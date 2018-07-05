import React, { Component } from "react";
import propTypes from "prop-types";
import store from "../CouterStore";
import actions from "../Actions";

export default class ClientCounter extends Component {
  static propTypes = {
    index: propTypes.number.isRequired,
    caption: propTypes.string.isRequired,
    onChange: propTypes.func
  };

  static defalutProps = {
    caption: ""
  };

  constructor(props, context) {
    super(props, context);

    this.state = { count: store.getValues()[this.props.index] };
    this.handleClickIncrementButton = this.handleClickIncrementButton.bind(
      this
    );
    this.handleClickDecrementButton = this.handleClickDecrementButton.bind(
      this
    );
  }

  componentDidMount() {
    store.addChangeListener(this.hanldeChange.bind(this));
  }

  componentWillUnmount() {
    store.removeChangeListener(this.hanldeChange.bind(this));
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
    actions.increment(this.props.index);
  }

  handleClickDecrementButton() {
    actions.decrement(this.props.index);
  }

  hanldeChange() {
    this.setState(prevState => {
      let nextCount = store.getValues()[this.props.index];
      prevState.count = nextCount;
      this.props.onChange && this.props.onChange(nextCount);

      return prevState;
    });
  }
}
