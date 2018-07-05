import React, { Component } from "react";
import propTypes from "prop-types";
import ClientCounter from "./ClientCounter";
import store from "../CouterStore";

export default class ControlPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { values: store.getValues() };
  }

  render() {
    let { defaultValues } = this.props;

    return (
      <div style={{ margin: "16px" }}>
        <ClientCounter
          index={0}
          onChange={v => this.handleCounterChange(0, v)}
          caption="First"
          defaultValue={defaultValues[0]}
        />
        <ClientCounter
          index={1}
          onChange={v => this.handleCounterChange(1, v)}
          caption="Second"
          defaultValue={defaultValues[1]}
        />
        <ClientCounter
          index={2}
          onChange={v => this.handleCounterChange(2, v)}
          caption="Third"
          defaultValue={defaultValues[2]}
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
