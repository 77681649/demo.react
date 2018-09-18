/**
 * dva
 * 创建application -- 提供application级别API
 *  start  - 负责渲染出App
 *  router - 负责添加Router
 *  model  - 负责添加Model
 *  use    - 负责添加hook
 */
import React from "react";
import invariant from "invariant";
import createHashHistory from "history/createHashHistory";
import { routerMiddleware, routerReducer as routing } from "react-router-redux";
import document from "global/document";
import { Provider } from "react-redux";
import * as core from "dva-core";
import { isFunction } from "dva-core/lib/utils";

/**
 * 创建app
 * @params {Object} options 选项
 */
export default function(opts = {}) {
  // 创建history
  const history = opts.history || createHashHistory();

  const createOpts = {
    // react-router-redux 需要的reducer
    initialReducer: {
      routing
    },

    // 初始化createStore时, 安装的插件
    setupMiddlewares(middlewares) {
      return [routerMiddleware(history), ...middlewares];
    },

    // 
    setupApp(app) {
      app._history = patchHistory(history);
    }
  };

  // 创建dva实例
  const app = core.create(opts, createOpts);

  // dva start
  const oldAppStart = app.start;

  // router API
  app.router = router;

  // start API
  app.start = start;

  return app;

  /**
   * 
   * @param {Function} router 一个函数, 返回一个Router对象
   */
  function router(router) {
    invariant(
      isFunction(router),
      `[app.router] router should be function, but got ${typeof router}`
    );
    app._router = router;
  }

  /**
   * wrap 启动应用
   * @param {String|HTMLElement} container App组件的容器
   * @returns {ReactElement|undefined} 
   */
  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    // if (isString(container)) {
    //   container = document.querySelector(container);
    //   invariant(container, `[app.start] container ${container} not found`);
    // }

    // 并且是 HTMLElement
    // invariant(
    //   !container || isHTMLElement(container),
    //   `[app.start] container should be HTMLElement`
    // );

    // 路由必须提前注册
    invariant(
      app._router,
      `[app.start] router must be registered before app.start()`
    );

    // 
    if (!app._store) {
      oldAppStart.call(app);
    }

    const store = app._store;

    // export _getProvider for HMR
    // ref: https://github.com/dvajs/dva/issues/469
    app._getProvider = getProvider.bind(null, store, app);

    // If has container, render; else, return react component
    if (container) {
      render(container, store, app, app._router);
      app._plugin.apply("onHmr")(render.bind(null, container, store, app));
    } else {
      return getProvider(store, this, this._router);
    }
  }
}

/**
 * 
 */
function isHTMLElement(node) {
  return (
    typeof node === "object" && node !== null && node.nodeType && node.nodeName
  );
}

/**
 *
 * @param {*} str
 */
function isString(str) {
  return typeof str === "string";
}

/**
 * 创建App组件
 * @param {redux.Store} store
 * @param {Dva} app
 * @param {Function} router
 * @returns {ReactComponent} 返回一个App组件
 */
function getProvider(store, app, router) {
  const DvaRoot = extraProps => (
    <Provider store={store}>
      {router({ app, history: app._history, ...extraProps })}
    </Provider>
  );

  return DvaRoot;
}

/**
 * 渲染
 */
function render(container, store, app, router) {
  // const ReactDOM = require("react-dom"); // eslint-disable-line
  // ReactDOM.render(
  //   React.createElement(getProvider(store, app, router)),
  //   container
  // );

  const ReactDOM = require('react-dom-server')

  console.log(
    ReactDOM.renderToString(
      React.createElement(getProvider(store, app, router)),
      container
    )
  )
}

/**
 * 
 */
function patchHistory(history) {
  const oldListen = history.listen;
  
  history.listen = callback => {
    callback(history.location);
    return oldListen.call(history, callback);
  };

  return history;
}
