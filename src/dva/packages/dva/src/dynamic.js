/**
 * 动态加载
 *  1. Router Component 动态加载
 *  2. Router Component Models 动态加载
 *
 * @author    王骁(Sean Wang) <Sean.Wang@u-technologies.com>
 */
import React, { Component } from 'react';

const cached = {};
function registerModel(app, model) {
  model = model.default || model;
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

let defaultLoadingComponent = () => null;

/**
 * 创建一个异步组件
 * @param {*} config 
 * @param {dva.App} config.app
 * @param {Promise} config.component
 * @param {Promise} config.models
 * @param {Promise} config.resolve
 * @param {React.Component} config.LoadingComponent 当组件没有加载好时显示的组件
 * 
 * @returns {React.Component} 返回一个dynamic component, 等待资源加载完毕之后, 才会开始渲染组件
 */
function asyncComponent(config) {
  const { resolve } = config;

  return class DynamicComponent extends Component {
    constructor(...args) {
      super(...args);
      
      this.LoadingComponent =
        config.LoadingComponent || defaultLoadingComponent;
      
      this.state = {
        AsyncComponent: null,
      };

      this.load();
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    load() {
      resolve()
        .then((m) => {
          // 加载完毕
          const AsyncComponent = m.default || m;

          // update state 
          if (this.mounted) {
            this.setState({ AsyncComponent });
          } else {
            this.state.AsyncComponent = AsyncComponent; // eslint-disable-line
          }
        });
    }

    render() {
      const { AsyncComponent } = this.state;
      const { LoadingComponent } = this;

      // has AsyncComponent, 说明已经加载好 
      return AsyncComponent
        ? <AsyncComponent {...this.props} />
        : <LoadingComponent {...this.props} />
    }
  };
}

export default function dynamic(config) {
  const { 
    app,                                  // dva APP 实例
    models: resolveModels,                // 通过import, 异步请求的models
    component: resolveComponent           // 通过import, 异步请求的组件
  } = config;
  
  return asyncComponent({
    resolve: config.resolve || defaultResolve,
    ...config,
  });


  function defaultResolve() {
    // resolve models
    const models = typeof resolveModels === 'function' 
      ? resolveModels() 
      : [];

    // resolve component
    const component = resolveComponent();
    
    return new Promise((resolve) => {
      // 并行加载数据
      Promise.all([...models, component])
        .then((ret) => {
          const hasModels = models && models.length

          if (hasModels) {
            const len = models.length;

            // register model
            ret.slice(0, len).forEach((m) => {
              m = m.default || m;
              if (!Array.isArray(m)) {
                m = [m];
              }
              m.map(_ => registerModel(app, _));
            });

            // resolve component
            resolve(ret[len]);
          } else {
            // 直接resolve component
            return resolve(ret[0]);
          }
        });
    });
  }
}

/**
 * 设置默认的loading component
 */
dynamic.setDefaultLoadingComponent = (LoadingComponent) => {
  defaultLoadingComponent = LoadingComponent;
};
