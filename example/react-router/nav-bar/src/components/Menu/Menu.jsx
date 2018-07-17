import React, { Component } from "react";
import types from "prop-types";
import "./Menu.css";

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    selectKey: types.string,
    onClick: types.func,
    children: types.node
  };

  render() {
    let { children } = this.props;

    return <ul className="menu">{children}</ul>;
  }

  handleClick(e) {
    let { onClick } = this.props;

    onClick && onClick(e);
  }
}
