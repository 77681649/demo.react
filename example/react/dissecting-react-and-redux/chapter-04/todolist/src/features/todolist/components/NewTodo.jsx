import React from "react";
import "./Todo.css";
import EditableTodoContent from "./EditableTodoContent";

export default ({ editable, content }) => {
  return (
    <div className="todo">
      <div className="todo-button">
        <span className="todo-icon-new">+</span>
      </div>
      <div className="todo-content">
        <EditableTodoContent content={content} />
      </div>
    </div>
  );
};
