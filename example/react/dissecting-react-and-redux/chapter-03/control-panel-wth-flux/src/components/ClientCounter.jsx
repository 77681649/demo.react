import React, { Component } from "react";
import propTypes from "prop-types";

export default class ClientCounter extends Component {
  static propTypes = {
    caption: propTypes.string.isRequired,
    defaultValue: propTypes.number.isRequired,
    onChange: propTypes.func
  };

  static defalutProps = {
    caption: "",
    defaultValue: 0
  };

  constructor(props, context) {
    super(props, context);

    this.state = { count: props.defaultValue };
    this.handleClickIncrementButton = this.handleClickIncrementButton.bind(
      this
    );
    this.handleClickDecrementButton = this.handleClickDecrementButton.bind(
      this
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log("enter componentWillReceiveProps", this.props.caption);
  }

  render() {
    let { caption } = this.props;

    return (
      <div>
        <button onClick={this.handleClickIncrementButton}>+</button>
        <button onClick={this.handleClickDecrementButton}>-</button>
        <span>
          {caption} Count: {this.state.count}
        </span>
      </div>
    );
  }

  handleClickIncrementButton() {
    this.hanldeChange(true);
  }

  handleClickDecrementButton() {
    this.hanldeChange(false);
  }

  hanldeChange(isIncrement) {
    let nextCount = this.state.count + (isIncrement ? 1 : -1);

    this.setState(prevState => {
      prevState.count = nextCount;
      this.props.onChange && this.props.onChange(this.state.count);
    });
  }
}
