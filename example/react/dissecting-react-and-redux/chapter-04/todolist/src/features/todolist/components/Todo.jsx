import React from "react";
import "./Todo.css";
import Checkbox from "./Checkbox";
import EditableTodoContent from "./EditableTodoContent";
import TodoContent from "./TodoContent";

export default ({ editable, content, completed }) => {
  return (
    <div className={`todo ${completed ? "completed" : ""}`}>
      <div className="todo-button">
        <Checkbox checked={completed} />
      </div>
      <div className="todo-content">
        {editable ? (
          <EditableTodoContent content={content} />
        ) : (
          <TodoContent content={content} />
        )}
      </div>
    </div>
  );
};
