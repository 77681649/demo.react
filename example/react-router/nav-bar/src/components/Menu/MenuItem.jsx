import React, { Component } from "react";
import types from "prop-types";
import classNames from "class-names";
import "./MenuItem.css";

export default class MenuItem extends Component {
  static propTypes = {
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
    active: this.props.active,
    selected: this.props.selected
  };

  render() {
    let { disabled, children } = this.props;
    let { active, selected } = this.state;
    let className = classNames("menu-item", {
      "menu-item-disabled": disabled,
      "menu-item-active": !disabled && active,
      "menu-item-active": !disabled && selected
    });

    return (
      <li
        className={className}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </li>
    );
  }

  handleClick() {
    this.props.onClick && this.props.onClick();
  }

  handleMouseOver() {
    this.setState({ active: true });
  }

  handleMouseLeave() {
    this.setState({ active: false });
  }
}
