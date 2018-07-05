import React, { Component } from "react";
import propTypes from "prop-types";
import actions from "../actions";

export default class ClientCounter extends Component {
  static propTypes = {
    index: propTypes.number.isRequired,
    caption: propTypes.string.isRequired
  };

  static defalutProps = {
    caption: ""
  };

  constructor(props, context) {
    super(props, context);

    this.handleClickIncrementButton = this.handleClickIncrementButton.bind(
      this
    );
    this.handleClickDecrementButton = this.handleClickDecrementButton.bind(
      this
    );
  }

  render() {
    let { caption } = this.props;

    return (
      <div>
        <button onClick={this.handleClickIncrementButton}>+</button>
        <button onClick={this.handleClickDecrementButton}>-</button>
        <span>
          {caption} Count: {this.props.count}
        </span>
      </div>
    );
  }

  handleClickIncrementButton() {
    actions.increment(this.props.index);
  }

  handleClickDecrementButton() {
    actions.decrement(this.props.index);
  }
}
