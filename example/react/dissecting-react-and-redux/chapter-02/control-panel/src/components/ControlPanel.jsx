import React, { Component } from "react";
import propTypes from "prop-types";
import ClientCounter from "./ClientCounter";

const fixArray = propTypes.arrayOf(function(
  propValue,
  key,
  componentName,
  location,
  propFullName
) {
  if (
    !(
      Array.isArray(propValue) &&
      propValue.length === 3 &&
      propValue.every(p => typeof p === "number")
    )
  ) {
    return new Error(
      "Invalid prop `" +
        propValue +
        "` supplied to" +
        " `" +
        componentName +
        "`. Validation failed."
    );
  }
});

export default class ControlPanel extends Component {
  static propTypes = {
    defaultValues: fixArray.isRequired
  };

  static defaultProps = {
    defaultValues: [3, 5, 10]
  };

  constructor(props, context) {
    super(props, context);

    this.state = { values: props.defaultValues };
  }

  render() {
    let { defaultValues } = this.props;

    return (
      <div style={{ margin: "16px" }}>
        <ClientCounter
          onChange={v => this.handleCounterChange(0, v)}
          caption="First"
          defaultValue={defaultValues[0]}
        />
        <ClientCounter
          onChange={v => this.handleCounterChange(1, v)}
          caption="Second"
          defaultValue={defaultValues[1]}
        />
        <ClientCounter
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
