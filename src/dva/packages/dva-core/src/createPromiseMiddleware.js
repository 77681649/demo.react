import { NAMESPACE_SEP } from './constants';

/**
 * 创建 redux-promise 中间件 - 处理effect
 * @param {Dva} app app实例
 * @returns {redux.Middleware} 返回一个redux中间件
 */
export default function createPromiseMiddleware(app) {
  return () => next => action => {
    const { type } = action;
    
    if (isEffect(type)) {
      // 包装一个Pormise, 处理effect
      return new Promise((resolve, reject) => {
        next({
          __dva_resolve: resolve,
          __dva_reject: reject,
          ...action,
        });
      });
    } else {
      return next(action);
    }
  };

  /**
   * 判断是否是一个 effect
   * @param {String} type action.type
   * @returns {Boolean} 
   */
  function isEffect(type) {
    if (!type || typeof type !== 'string') return false;
    
    // 获得namespace
    const [namespace] = type.split(NAMESPACE_SEP);

    // 找到namespace对应的model
    const model = app._models.filter(m => m.namespace === namespace)[0];

    // 判断model中是否有指定的effect
    if (model) {
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }
}
