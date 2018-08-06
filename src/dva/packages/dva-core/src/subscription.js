import warning from 'warning';
import { isFunction } from './utils';
import prefixedDispatch from './prefixedDispatch';

/**
 * @param {Object} subs
 * @param {dva.Model} model model对象
 * @param {dva.Application} app对象
 * @param {Function} onError 当发生错误时, 调用的函数
 * @returns {Object} 
 */
export function run(subs, model, app, onError) {
  const funcs = [];
  const nonFuncs = [];

  for (const key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      const sub = subs[key];
      
      const unlistener = sub({
        dispatch: prefixedDispatch(app._store.dispatch, model),
        history: app._history,
      }, onError);

      if (isFunction(unlistener)) {
        funcs.push(unlistener);
      } else {
        nonFuncs.push(key);
      }
    }
  }

  return { funcs, nonFuncs };
}

/**
 * @param {} unlisteners
 * @param {} namespace
 */
export function unlisten(unlisteners, namespace) {
  if (!unlisteners[namespace]) return;

  const { funcs, nonFuncs } = unlisteners[namespace];
  warning(
    nonFuncs.length === 0,
    `[app.unmodel] subscription should return unlistener function, check these subscriptions ${nonFuncs.join(', ')}`,
  );
  for (const unlistener of funcs) {
    unlistener();
  }
  delete unlisteners[namespace];
}
