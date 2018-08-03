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
 * 从obj中筛选出hook
 * @param {*} obj
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
   * 加载插件
   * @param {Object} plugin 插件
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
   * 执行插件
   * @param {String} key key
   * @param {Function} defaultHandler 默认的处理器
   */
  apply(key, defaultHandler) {
    const hooks = this.hooks;
    const validApplyHooks = ["onError", "onHmr"];

    invariant(
      validApplyHooks.indexOf(key) > -1,
      `plugin.apply: hook ${key} cannot be applied`
    );

    const fns = hooks[key];

    return (...args) => {
      if (fns.length) {
        for (const fn of fns) {
          fn(...args);
        }
      } else if (defaultHandler) {
        defaultHandler(...args);
      }
    };
  }

  /**
   *
   * @param {*} key
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
 *
 * @param {*} hook
 */
function getExtraReducers(hook) {
  let ret = {};
  for (const reducerObj of hook) {
    ret = { ...ret, ...reducerObj };
  }
  return ret;
}

/**
 *
 */
function getOnReducer(hook) {
  return function(reducer) {
    for (const reducerEnhancer of hook) {
      reducer = reducerEnhancer(reducer);
    }
    return reducer;
  };
}
