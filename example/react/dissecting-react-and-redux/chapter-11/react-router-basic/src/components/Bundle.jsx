/**
 *
 */
import React, { Component } from "react";

export default class Bundle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mod: null
    };
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  render() {
    let { mod } = this.state;

    // 渲染异步模块
    return mod ? this.props.children(mod) : null;
  }

  // 加载外部传递的异步模块
  load(props) {
    this.setState({ mod: null }, () => {
      props.load().then(mod => {
        this.setState({ mod: mod.default ? mod.default : mod });
      });
    });
  }
}
