import React, { Component } from "react";
import types from "prop-types";
import "./Menu.css";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  static propTypes = {
    onClick: types.func,
    children: types.node
  };

  render() {
    let { children } = this.props;

    return (
      <ul className="menu">
        {React.Children.map(children, c => {
          return React.cloneElement(c, {
            keyProp: c.key,
            selected: c.key === this.props.selectedKey,
            onClick: this.handleClick
          });
        })}
      </ul>
    );
  }

  handleClick(e) {
    let { onClick } = this.props;

    onClick && onClick(e);
  }
}
