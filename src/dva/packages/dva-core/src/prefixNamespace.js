import warning from 'warning';
import { isArray } from './utils';
import { NAMESPACE_SEP } from './constants';

/**
 * 为对象Obj的属性名添加前缀namespace
 * @param {Object} obj 对象
 * @param {String} namespace 命名空间
 * @param {String} type 类型 
 * @returns {Object} 返回结果对象
 */
function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce((memo, key) => {
    // 警告: 无需手动在添加前缀
    warning(
      key.indexOf(`${namespace}${NAMESPACE_SEP}`) !== 0,
      `[prefixNamespace]: ${type} ${key} should not be prefixed with namespace ${namespace}`,
    );

    // 格式: namespace/key
    const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = obj[key];
    
    return memo;
  }, {});
}

/**
 * 为model的reducers,effects中的action.type,添加namespace前缀
 * 
 * @example
 * model({
 *  namespace:'example',
 *  reducers: {
 *    a:function(state,action){},
 *  },
 *  effects: {
 *    b:function(state,effects){}
 *  }
 * })
 * 
 * // 输出
 * model({
 *  namespace:'example',
 *  reducers: {
 *    'example/a':function(state,action){},
 *  },
 *  effects: {
 *    'example/b':function(state,effects){}
 *  }
 * })
 * 
 * @param {dva.Model} model model对象
 * @returns {dva.Model} 返回model对象
 */
export default function prefixNamespace(model) {
  const {
    namespace,
    reducers,
    effects,
  } = model;

  // add prefix for reducers
  if (reducers) {
    if (isArray(reducers)) {
      model.reducers[0] = prefix(reducers[0], namespace, 'reducer');
    } else {
      model.reducers = prefix(reducers, namespace, 'reducer');
    }
  }

  // add prefix for effects
  if (effects) {
    model.effects = prefix(effects, namespace, 'effect');
  }

  return model;
}
