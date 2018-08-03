import { NAMESPACE_SEP } from './constants';

/**
 * 创建 redux-promise 中间件
 * @param {Dva} app 
 */
export default function createPromiseMiddleware(app) {
  return () => next => action => {
    const { type } = action;
    
    if (isEffect(type)) {
      // 包装为promise
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

    // 获得model
    const model = app._models.filter(m => m.namespace === namespace)[0];
    
    if (model) {
      // 如果找到, 说明是effect
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }
}
