import invariant from "invariant";
import { isPlainObject } from "./utils";

const hooks = [
  "onError",
  "onStateChange",
  "onAction",
  "onHmr",
  "onReducer",
  "onEffect",
  "extraReducers",
  "extraEnhancers",
  "_handleActions"
];

/**
 * 从obj中筛选出有效的hooks
 * @param {Object} obj 选项
 * @returns {Object} 返回筛选出的hooks
 */
export function filterHooks(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    if (hooks.indexOf(key) > -1) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
}

/**
 * 插件系统
 */
export default class Plugin {
  constructor() {
    this._handleActions = null;
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {});
  }

  /**
   * 安装插件
   * @param {Object} plugin hooks集合
   */
  use(plugin) {
    invariant(
      isPlainObject(plugin),
      "plugin.use: plugin should be plain object"
    );

    const hooks = this.hooks;

    for (const key in plugin) {
      if (Object.prototype.hasOwnProperty.call(plugin, key)) {
        // 检查是不是已知属性
        invariant(hooks[key], `plugin.use: unknown plugin property: ${key}`);

        if (key === "_handleActions") {
          // 值允许有一个
          this._handleActions = plugin[key];
        } else if (key === "extraEnhancers") {
          // 值允许有一个
          hooks[key] = plugin[key];
        } else {
          // 允许有多个
          hooks[key].push(plugin[key]);
        }
      }
    }
  }

  /**
   * 执行 指定插件
   * @param {String} key 插件名
   * @param {Function} [defaultHandler] 默认的处理器, 如果没有注册对应的插件, 那么使用默认的处理器
   * @returns {Function} 返回一个wrap, 负责执行对应的处理器
   */
  apply(key, defaultHandler) {
    // 插件集合
    const hooks = this.hooks;
    // 可执行的插件
    const validApplyHooks = ["onError", "onHmr"];

    // 确保hook可执行
    invariant(
      validApplyHooks.indexOf(key) > -1,
      `plugin.apply: hook ${key} cannot be applied`
    );

    const fns = hooks[key];

    return (...args) => {
      if (fns.length) {
        // 依次执行
        for (const fn of fns) {
          fn(...args);
        }
      } else if (defaultHandler) {
        defaultHandler(...args);
      }
    };
  }

  /**
   * 执行指定的hook getter, 返回得到的值
   * @param {String} key hook key
   * @returns {any} 返回得到的值
   */
  get(key) {
    const hooks = this.hooks;
    invariant(key in hooks, `plugin.get: hook ${key} cannot be got`);

    if (key === "extraReducers") {
      return getExtraReducers(hooks[key]);
    } else if (key === "onReducer") {
      return getOnReducer(hooks[key]);
    } else {
      return hooks[key];
    }
  }
}

/**
 * 获得 额外配置的reducer
 * @param {Object} hook 
 * @returns {Object}
 */
function getExtraReducers(hook) {
  let ret = {};
  
  for (const reducerObj of hook) {
    ret = { ...ret, ...reducerObj };
  }

  return ret;
}

/**
 * @param {Object} hook
 * @returns {Function}
 */
function getOnReducer(hook) {
  return function(reducer) {
    for (const reducerEnhancer of hook) {
      reducer = reducerEnhancer(reducer);
    }
    return reducer;
  };
}
