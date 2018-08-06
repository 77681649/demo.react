import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga/lib/internal/middleware";
import invariant from "invariant";
import checkModel from "./checkModel";
import prefixNamespace from "./prefixNamespace";
import Plugin, { filterHooks } from "./Plugin";
import createStore from "./createStore";
import getSaga from "./getSaga";
import getReducer from "./getReducer";
import createPromiseMiddleware from "./createPromiseMiddleware";
import {
  run as runSubscription,
  unlisten as unlistenSubscription
} from "./subscription";
import { noop } from "./utils";

// Internal model to update global state when do unmodel
const dvaModel = {
  namespace: "@@dva",
  state: 0,
  reducers: {
    UPDATE(state) {
      return state + 1;
    }
  }
};

/**
 * Create dva-core instance.
 *  1. 创建Plugin
 *  2. add prefix for model
 * @param hooksAndOpts {Object} hooks和其他选项
 * @param createOpts {Object} 创建时的选项
 * @returns {DvaCore} 返回一个dva-core实例
 */
export function create(hooksAndOpts = {}, createOpts = {}) {
  const { initialReducer, setupApp = noop } = createOpts;

  // 创建插件系统
  const plugin = new Plugin();

  // 应用插件
  plugin.use(filterHooks(hooksAndOpts));

  // 创建app对象
  const app = {
    _models: [prefixNamespace({ ...dvaModel })],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin),
    model,
    start
  };

  return app;

  /**
   * Register model before app is started.
   * 在app启动之前,注册Model
   *
   * @param m {Object} model to register
   * @returns {Object} 返回注册的model
   */
  function model(m) {
    if (process.env.NODE_ENV !== "production") {
      checkModel(m, app._models);
    }

    // add prefix
    const prefixedModel = prefixNamespace({ ...m });

    // add model list
    app._models.push(prefixedModel);

    return prefixedModel;
  }

  /**
   * Inject model after app is started.
   * 在app启动之后, 注入model
   * @param {Function} createReducer reducer创建函数
   * @param {Function} onError 错误处理函数
   * @param {Object} unlisteners subscription subscribe
   * @param {Model} m model配置
   */
  function injectModel(createReducer, onError, unlisteners, m) {
    m = model(m);

    const store = app._store;

    // 创建async reducer
    store.asyncReducers[m.namespace] = getReducer(
      m.reducers,
      m.state,
      plugin._handleActions
    );

    // 用新的reducers替换
    store.replaceReducer(createReducer(store.asyncReducers));

    // 创建 && 执行 saga
    if (m.effects) {
      store.runSaga(
        app._getSaga(m.effects, m, onError, plugin.get("onEffect"))
      );
    }

    // run subscription
    if (m.subscriptions) {
      unlisteners[m.namespace] = runSubscription(
        m.subscriptions,
        m,
        app,
        onError
      );
    }
  }

  /**
   * Unregister model.
   *
   * @param createReducer
   * @param reducers
   * @param unlisteners
   * @param namespace
   *
   * Unexpected key warn problem:
   * https://github.com/reactjs/redux/issues/1636
   */
  function unmodel(createReducer, reducers, unlisteners, namespace) {
    const store = app._store;

    // Delete reducers
    delete store.asyncReducers[namespace];
    delete reducers[namespace];

    // 替换reducer
    store.replaceReducer(createReducer());

    // 发送
    store.dispatch({ type: "@@dva/UPDATE" });

    // Cancel effects
    store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` });

    // Unlisten subscrioptions
    unlistenSubscription(unlisteners, namespace);

    // Delete model from app._models
    app._models = app._models.filter(model => model.namespace !== namespace);
  }

  /**
   * Start the app.
   *
   * @returns void
   */
  function start() {
    /**
     * Global error handler
     * @param {Error|String} err 错误对象或错误消息
     * @param {Any[]} extension 额外的参数
     */
    const onError = (err, extension) => {
      if (err) {
        if (typeof err === "string") err = new Error(err);

        err.preventDefault = () => {
          err._dontReject = true;
        };

        plugin.apply("onError", err => {
          throw new Error(err.stack || err);
        })(err, app._store.dispatch, extension);
      }
    };

    // 创建redux-saga saga-middleware
    const sagaMiddleware = createSagaMiddleware();

    // 创建promise-middlware
    const promiseMiddleware = createPromiseMiddleware(app);

    // 暴露getSaga
    // .bind 避免污染getSaga
    app._getSaga = getSaga.bind(null);

    // 存储sagas
    const sagas = [];

    // 存储app reducers
    const reducers = { ...initialReducer };

    //
    // 遍历model
    // 1. 生成model.reducer
    // 2. model.saga
    //
    for (const m of app._models) {
      /**
       * 生成model的sync reducer
       */
      reducers[m.namespace] = getReducer(
        m.reducers,
        m.state,
        plugin._handleActions
      );

      /**
       * 生成model的async reducer
       */
      if (m.effects)
        sagas.push(app._getSaga(m.effects, m, onError, plugin.get("onEffect")));
    }

    // 获得 reducerEnhancer
    const reducerEnhancer = plugin.get("onReducer");

    // 获得 额外的reducers
    const extraReducers = plugin.get("extraReducers");

    invariant(
      Object.keys(extraReducers).every(key => !(key in reducers)),
      `[app.start] extraReducers is conflict with other reducers, reducers list: ${Object.keys(
        reducers
      ).join(", ")}`
    );

    // Create store
    const reduxStore = createStore({
      reducers: createReducer(),
      initialState: hooksAndOpts.initialState || {},
      plugin,
      createOpts,
      sagaMiddleware,
      promiseMiddleware
    });

    const store = (app._store = reduxStore);

    // Extend store
    store.runSaga = sagaMiddleware.run;
    store.asyncReducers = {};

    // Execute listeners when state is changed
    const listeners = plugin.get("onStateChange");
    for (const listener of listeners) {
      store.subscribe(() => {
        listener(store.getState());
      });
    }

    // Run sagas
    sagas.forEach(sagaMiddleware.run);

    // Setup app
    setupApp(app);

    // Run subscriptions
    const unlisteners = {};

    for (const model of this._models) {
      if (model.subscriptions) {
        unlisteners[model.namespace] = runSubscription(
          model.subscriptions,
          model,
          app,
          onError
        );
      }
    }

    // Setup app.model and app.unmodel
    app.model = injectModel.bind(app, createReducer, onError, unlisteners);
    app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);

    /**
     * Create global reducer for redux.
     *
     * @returns {Function} 返回一个reducer
     */
    function createReducer() {
      return reducerEnhancer(
        combineReducers({
          ...reducers,
          ...extraReducers,
          ...(app._store ? app._store.asyncReducers : {})
        })
      );
    }
  }
}
