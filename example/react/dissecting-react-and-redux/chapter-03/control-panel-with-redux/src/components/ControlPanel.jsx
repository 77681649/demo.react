import React, { Component } from "react";
import propTypes from "prop-types";
import Counter from "../containers/Counter";

export default class ControlPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { values: props.defaultValues };
  }

  render() {
    return (
      <div style={{ margin: "16px" }}>
        <Counter
          index={0}
          onChange={v => this.handleCounterChange(0, v)}
          caption="First"
        />
        <Counter
          index={1}
          onChange={v => this.handleCounterChange(1, v)}
          caption="Second"
        />
        <Counter
          index={2}
          onChange={v => this.handleCounterChange(2, v)}
          caption="Third"
        />
        <hr />
        <div>Total Count:{this.sum()}</div>
      </div>
    );
  }

  handleCounterChange(index, nextValue) {
    let values = this.state.values;
    values[index] = nextValue;

    this.setState({ values });
  }

  sum() {
    return this.state.values.reduce((s, v) => (s += v), 0);
  }
}
