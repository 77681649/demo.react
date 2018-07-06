import React from "react";
import Todo from "./Todo";
import NewTodo from "./NewTodo";
import "./TodoList.css";

export default function TodoList({ data, showCompleted }) {
  return (
    <ul className="todo-list">
      {data
        ? data.map(({ data: { id, content, completed }, editable }) => (
            <li key={id}>
              <Todo
                editable={editable}
                content={content}
                completed={completed}
              />
            </li>
          ))
        : null}
      <li key="new">
        <NewTodo />
      </li>
    </ul>
  );
}
