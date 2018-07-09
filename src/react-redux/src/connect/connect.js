/**
 * connect
 * 负责定义connect工厂方法,connect函数
 */

import connectAdvanced from "../components/connectAdvanced";
import shallowEqual from "../utils/shallowEqual";
import defaultMapDispatchToPropsFactories from "./mapDispatchToProps";
import defaultMapStateToPropsFactories from "./mapStateToProps";
import defaultMergePropsFactories from "./mergeProps";
import defaultSelectorFactory from "./selectorFactory";

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

/**
 *
 * @param {*} arg
 * @param {*} factories
 * @param {string} name
 * @returns {}
 */
function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg);
    if (result) return result;
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    );
  };
}

/**
 * 严格相等
 */
function strictEqual(a, b) {
  return a === b;
}

/**
 * 创建一个connect函数
 *
 * createConnect with default args builds the 'official' connect behavior. Calling it with
 * different options opens up some testing and extensibility scenarios
 *
 * createConnect:
 *  使用默认参数来构建"官方"的行为
 *  通过不同参数可以满足一些测试和扩展性的场景
 *
 * @params {Object} options 选项
 * @params {Function} options.connectHOC connect高阶组件
 * @params {Function} options.mapStateToPropsFactories 工厂方法
 * @params {Function} options.mapDispatchToPropsFactories 工厂方法
 * @params {Function} options.mergePropsFactories 工厂方法
 * @returns {Function} 返回一个connect函数
 */
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
} = {}) {
  // 定义并返回一个connncet函数
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
  ) {
    //
    const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      "mapStateToProps"
    );

    //
    const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      "mapDispatchToProps"
    );

    //
    const initMergeProps = match(mergeProps, mergePropsFactories, "mergeProps");

    return connectHOC(selectorFactory, {
      // used in error messages
      methodName: "connect",

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: name => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions
    });
  };
}

export default createConnect();
