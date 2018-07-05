import React, { Component } from "react";
import storePropType from "./storePropType";
import hoistNonReactStatics from "./hoistNonReactStatics";
import shallowEqual from "./shallowEqual";
import { debug } from "util";

const defaultMapStateToProps = store => ({});
const defaultDispatchToProps = dispatch => ({ dispatch });
const defaultMergeProps = (stateProps, parentProps) =>
  Object.assign({}, parentProps, stateProps);

export default (mapStateToProps, mapDispatchToProps, mergeProps) => {
  mapStateToProps = mapStateToProps || defaultMapStateToProps;
  mapDispatchToProps = mapDispatchToProps || defaultDispatchToProps;
  mergeProps = mergeProps || defaultMergeProps;

  return WrappedComponent => {
    class Connect extends Component {
      /**
       * 定义返回给子组件的上下文结构
       */
      static childContextTypes = {
        store: storePropType
      };

      /**
       * 获得父组件的上下文
       */
      static contextTypes = {
        store: storePropType
      };

      getChildContext() {
        return { store: this.props.store || this.context.store };
      }

      constructor(props, context) {
        super(props, context);

        this.prevState = null;
        this.store = props.store || context.store;
      }

      /**
       * 定义返回给子组件的上下文
       */
      getChildContextProps() {
        return { store: storePropType };
      }

      componentDidMount() {
        this.trySubscribe();
      }

      componentWillReceiveProps(nextProps) {
        this.hasPropsChanged = shallowEqual(this.props, nextProps);
      }

      shouldComponentUpdate() {
        return this.hasPropsChanged || this.hasStoreStateChanged;
      }

      componentWillUnmount() {
        this.unsubscribe();
        this.store = null;
        this.prevState = null;

        this.stateToProps = null;
        this.dispatchToProps = null;
        this.prevMergedProps = null;

        this.renderElement = null;
      }

      render() {
        let renderElement;

        this.hasPropsChanged = false;
        this.hasStoreStateChanged = false;

        const mergedProps = mergeProps(
          Object.assign({}, this.stateToProps, this.dispatchToProps),
          this.props
        );

        if (!shallowEqual(this.prevMergedProps, mergedProps)) {
          this.prevMergedProps = mergedProps;
          renderElement = this.renderElement = (
            <WrappedComponent {...mergedProps} />
          );
        } else {
          renderElement = this.renderElement;
        }

        return renderElement;
      }

      trySubscribe() {
        if (this.store) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
        }
      }

      unsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

      handleChange() {
        if (this.store) {
          let nextState = this.store.getState();
          let isChanged = this.prevState !== nextState;

          if (isChanged) {
            let nextStoreState = (this.stateToProps = this.mapState(nextState));
            this.dispatchToProps = this.mapDispatch(this.store.dispatch);
            this.setState({ storeState: nextStoreState });
          }
        }
      }

      mapState(nextState) {
        if (!shallowEqual(this.prevState, nextState)) {
          this.hasStoreStateChanged = true;
          return mapStateToProps(nextState, this.props);
        } else {
          this.hasStoreStateChanged = false;
          return this.stateToProps;
        }
      }

      mapDispatch(dispatch) {
        return mapDispatchToProps(dispatch, this.props);
      }
    }

    return hoistNonReactStatics(Connect, WrappedComponent);
  };
};
