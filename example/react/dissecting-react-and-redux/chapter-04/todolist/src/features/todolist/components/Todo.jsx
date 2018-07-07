import React, { Component } from "react";
import "./Todo.css";
import Checkbox from "./Checkbox";
import EditableTodoContent from "./EditableTodoContent";
import TodoContent from "./TodoContent";

export default class Todo extends Component {
  constructor(props, context) {
    super(props, context);

    this.inputRef = React.createRef();
    this.state = { content: props.content };

    this.handleClick = this.handleClick.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  componentDidUpdate() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
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
      <div className={`todo ${completed ? "completed" : ""}`}>
        <div className="todo-button">
          {isNew ? (
            <span className="todo-icon-new">+</span>
          ) : (
            <Checkbox checked={completed} onChange={onSwitchCompleted} />
          )}
        </div>
        <div className="todo-content" onClick={this.handleClick}>
          {editable ? (
            <EditableTodoContent
              ref={this.inputRef}
              content={this.state.content}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
              onBlur={this.handleInputBlur}
            />
          ) : (
            <TodoContent content={content} />
          )}
        </div>
      </div>
    );
  }

  handleClick(e) {
    this.props.onEditable();
  }

  handleInputChange(e) {
    this.setState({ content: e.currentTarget.value });
  }

  handleInputKeyDown(e) {
    if (e.nativeEvent.key === "Enter") {
      this.props.onEditCompleted(this.state.content);
    }
  }

  handleInputBlur(e) {
    if (e.currentTarget.value) {
      this.props.onEditCompleted(this.state.content);
    }
  }
}
