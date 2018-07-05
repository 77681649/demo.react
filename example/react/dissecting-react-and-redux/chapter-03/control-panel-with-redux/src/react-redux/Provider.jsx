import React, { Component } from "react";
import storePropType from "./storePropType";

export default class Provider extends Component {
  static childContextTypes = {
    store: storePropType
  };

  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return { store: this.props.store };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
