import React, { Component } from "react";
import { Link } from "react-router-dom";
import types from "prop-types";
import classNames from "class-names";
import "./MenuItem.css";

export default class MenuItem extends Component {
  static propTypes = {
    keyProp: types.string,
    active: types.bool,
    selected: types.bool,
    disabled: types.bool,
    onClick: types.func
    // onMouseOver: types.func,
    // onMouseLeave: types.func
  };

  static defaultPropType = {
    active: false,
    selected: false,
    disabled: false
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  state = {
    active: this.props.active
  };

  render() {
    let { selected, disabled, children, to } = this.props;
    let { active } = this.state;
    let className = classNames("menu-item", {
      "menu-item-disabled": disabled,
      "menu-item-active": !disabled && active,
      "menu-item-selected": !disabled && selected
    });

    return (
      <li
        className={className}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <Link to={to}>{children}</Link>
      </li>
    );
  }

  handleClick(e) {
    const item = {
      key: this.props.keyProp,
      item: this,
      domEvent: e.nativeEvent
    };

    this.props.onClick && this.props.onClick(item);
  }

  handleMouseOver() {
    this.setState({ active: true });
  }

  handleMouseLeave() {
    this.setState({ active: false });
  }
}
