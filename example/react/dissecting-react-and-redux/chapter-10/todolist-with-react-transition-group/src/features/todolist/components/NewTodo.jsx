import React, { Component } from "react";
import "./Todo.css";
import Checkbox from "./Checkbox";
import EditableTodoContent from "./EditableTodoContent";
import TodoContent from "./TodoContent";

export default class Todo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { content: "" };
    this.inputRef = React.createRef();

    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleCreateCompleted = this.handleCreateCompleted.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.valve = 0;
  }

  componentWillUnmount() {
    this.inputRef = null;
  }

  render() {
    let {
      id,
      editable,
      isNew,
      content,
      completed,
      onEditable,
      onSwitchCompleted
    } = this.props;
    return (
      <div className="todo">
        <div className="todo-button">
          <span className="todo-icon-new">+</span>
        </div>
        <div className="todo-content">
          <EditableTodoContent
            ref={this.inputRef}
            content={this.state.content}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            onBlur={this.handleCreateCompleted}
          />
        </div>
      </div>
    );
  }

  handleInputChange(e) {
    this.setState({ content: e.currentTarget.value });
  }

  handleInputKeyDown(e) {
    e.persist();

    if (e.nativeEvent.key === "Enter") {
      e.currentTarget.blur();
    }

    if (e.nativeEvent.key === "Escape") {
      this.setState({ content: "" }, () => {
        e.target.blur();
      });
    }
  }

  handleCreateCompleted(e) {
    if (e.currentTarget.value) {
      this.setState({ content: "" });
      this.props.onCreateCompleted(this.state.content);
    }
  }
}
