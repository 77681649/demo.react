import React, { Component } from "react";

export default class ClientCounter extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { count: 0 };
    this.handleClickButton = this.handleClickButton.bind(this);
  }

  render() {
    return (
      <div style={{ margin: "16px" }}>
        <button onClick={this.handleClickButton}>Click me</button>
        <div>Click Count: {this.state.count}</div>
      </div>
    );
  }

  handleClickButton() {
    this.setState(preState => {
      return { ...preState, count: preState.count + 1 };
    });
  }
}
