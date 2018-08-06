import { createStore, applyMiddleware, compose } from 'redux';
import flatten from 'flatten';
import invariant from 'invariant';
import window from 'global/window';
import { returnSelf, isArray } from './utils';

/**
 * 创建dva.store
 * @param {Object} options 选项
 * @param {Function} options.reducers rootReducer
 * @param {any} options.initialState 默认的初始状态
 * @param {Function} options.sagaMiddleware saga中间件
 * @param {Function} options.promiseMiddleware promise中间件
 * @param {Function} options.createOpts 创建选项
 * @returns {redux.Store} 返回创建的store
 */
export default function({
  reducers,
  initialState,
  plugin,
  sagaMiddleware,
  promiseMiddleware,
  createOpts: { setupMiddlewares = returnSelf },
}) {
  // extra enhancers
  const extraEnhancers = plugin.get('extraEnhancers');
  invariant(
    isArray(extraEnhancers),
    `[app.start] extraEnhancers should be array, but got ${typeof extraEnhancers}`
  );

  // 额外的中间件
  const extraMiddlewares = plugin.get('onAction');

  // 注册 中间件
  const middlewares = setupMiddlewares([
    promiseMiddleware,
    sagaMiddleware,
    ...flatten(extraMiddlewares),
  ]);

  // 添加 dev tools
  let devtools = () => noop => noop;
  if (
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__
  ) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
  }
  
  const enhancers = [
    applyMiddleware(...middlewares),
    ...extraEnhancers,
    devtools(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS),
  ];

  return createStore(reducers, initialState, compose(...enhancers));
}
