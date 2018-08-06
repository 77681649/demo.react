import invariant from 'invariant';
import * as sagaEffects from 'redux-saga/lib/effects';
import warning from 'warning';
import {
  takeEveryHelper as takeEvery,
  takeLatestHelper as takeLatest,
  throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers';
import { NAMESPACE_SEP } from './constants';
import prefixType from './prefixType';

/**
 * 为了effects创建一个saga
 * @param {Object} effects <action.type, effect> 处理指定action.type的effect
 * @param {dva.Model} model model对象
 * @param {Function} onError 当发生错误时触发
 * @param {Function} onEffect 
 * @returns {GeneratorFunction} 返回一个Genrator函数
 */
export default function getSaga(effects, model, onError, onEffect) {
  return function*() {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        // 创建一个worker
        const watcher = getWatcher(key, effects[key], model, onError, onEffect);

        // fork worker
        const task = yield sagaEffects.fork(watcher);
        
        // fork cancel
        yield sagaEffects.fork(function*() {
          // 监听取消
          yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);

          // 取消任务
          yield sagaEffects.cancel(task);
        });
      }
    }
  };
}

/**
 * 创建一个用于watch指定action.type的saga wacther
 * @param {String} key wacther.key (action.type)
 * @param {GeneratorFunction|Array} _effect 
 * @param {dva.Model} model model对象
 * @param {Function} onError 当发生错误时触发
 * @param {Function} onEffect 
 * @returns {GeneratorFunction} 返回一个Genrator函数
 */
function getWatcher(key, _effect, model, onError, onEffect) {
  let effect = _effect;
  let type = 'takeEvery';
  let ms;

  //
  // 解析effect tuple
  //
  if (Array.isArray(_effect)) {
    effect = _effect[0];
    const opts = _effect[1];
    if (opts && opts.type) {
      type = opts.type;
      if (type === 'throttle') {
        invariant(
          opts.ms,
          'app.start: opts.ms should be defined if type is throttle'
        );
        ms = opts.ms;
      }
    }
    invariant(
      ['watcher', 'takeEvery', 'takeLatest', 'throttle'].indexOf(type) > -1,
      'app.start: effect type should be takeEvery, takeLatest, throttle or watcher'
    );
  }

  /**
   * noop
   */
  function noop() {}

  /**
   * 创建一个saga
   * @param {any[]} ...args 
   */
  function* sagaWithCatch(...args) {
    const { 
      __dva_resolve: resolve = noop, 
      __dva_reject: reject = noop 
    } =
      args.length > 0 ? args[0] : {};

    try {
      // dispatch effect/@@start
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@start` });

      // 执行 effect
      const ret = yield effect(...args.concat(createEffects(model)));

      // dispatch
      yield sagaEffects.put({ type: `${key}${NAMESPACE_SEP}@@end` });
      
      resolve(ret);
    } catch (e) {
      // 捕获未处理的error
      onError(e, {
        key,
        effectArgs: args,
      });


      if (!e._dontReject) {
        reject(e);
      }
    }
  }

  // 执行onEffect
  const sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);

  // 根据watcher type, 创建saga watcher
  switch (type) {
    case 'watcher':
      return sagaWithCatch;
    case 'takeLatest':
      return function*() {
        yield takeLatest(key, sagaWithOnEffect);
      };
    case 'throttle':
      return function*() {
        yield throttle(ms, key, sagaWithOnEffect);
      };
    default:
      return function*() {
        yield takeEvery(key, sagaWithOnEffect);
      };
  }
}

/**
 * 根据model, 创建wrap effects
 * @param {dva.Model} model model实例
 * @returns {Object} 返回提供的effects
 */
function createEffects(model) {
  /**
   * 确保action.type有效
   * @param {String} type action.type
   * @param {String} name 方法名
   */
  function assertAction(type, name) {
    invariant(type, 'dispatch: action should be a plain Object with type');
    warning(
      type.indexOf(`${model.namespace}${NAMESPACE_SEP}`) !== 0,
      `[${name}] ${type} should not be prefixed with namespace ${
        model.namespace
      }`
    );
  }

  /**
   * wrap action
   * @param {Object} action 
   */
  function put(action) {
    const { type } = action;
    assertAction(type, 'sagaEffects.put');

    return sagaEffects.put({ ...action, type: prefixType(type, model) });
  }

  // wrap put.resolve
  // The operator `put` doesn't block waiting the returned promise to resolve.
  // Using `put.resolve` will wait until the promsie resolve/reject before resuming.
  // It will be helpful to organize multi-effects in order,
  // and increase the reusability by seperate the effect in stand-alone pieces.
  // https://github.com/redux-saga/redux-saga/issues/336
  function putResolve(action) {
    const { type } = action;
    assertAction(type, 'sagaEffects.put.resolve');
    return sagaEffects.put.resolve({
      ...action,
      type: prefixType(type, model),
    });
  }

  put.resolve = putResolve;

  /**
   * wrap take
   * @param {String|String[]|Function} type 
   */
  function take(type) {
    if (typeof type === 'string') {
      assertAction(type, 'sagaEffects.take');
      return sagaEffects.take(prefixType(type, model));
    } else if (Array.isArray(type)) {
      return sagaEffects.take(
        type.map(t => {
          if (typeof t === 'string') {
            assertAction(t, 'sagaEffects.take');
            return prefixType(type, model);
          }
          return t;
        })
      );
    } else {
      return sagaEffects.take(type);
    }
  }

  return { ...sagaEffects, put, take };
}

/**
 * 执行 onEffect
 * @param {Function[]} fns 一个或多个onEffect函数
 * @param {GeneratorFunction} effect effect
 * @param {dva.Model} model model对象
 * @param {String} key wacther.key (action.type)
 * @returns {GeneratorFunction} 返回一个effect
 */
function applyOnEffect(fns, effect, model, key) {
  for (const fn of fns) {
    effect = fn(effect, sagaEffects, model, key);
  }

  return effect;
}
