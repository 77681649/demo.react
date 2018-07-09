import React, { Component } from "react";

export default class AddTodo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { text: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTodoAdd = this.handleTodoAdd.bind(this);
  }

  render() {
    let { text } = this.state;

    return (
      <div>
        <input
          value={text}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={this.handleTodoAdd}>add</button>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleKeyDown(e) {
    if (!this.state.text) {
      return;
    }

    if (e.nativeEvent.key === "Enter") {
      this.handleTodoAdd();
    }

    if (e.nativeEvent.key === "Escape") {
      this.setState({ text: "" });
    }
  }

  handleTodoAdd() {
    this.props.onTodoAdd(this.state.text);
    this.setState({ text: "" });
  }
}
