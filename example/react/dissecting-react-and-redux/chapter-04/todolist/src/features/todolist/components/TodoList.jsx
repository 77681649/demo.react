import React from "react";
import NewTodo from "./NewTodo";
import EmptyTodo from "./EmptyTodo";
import Todo from "./Todo";
import "./TodoList.css";

const MIN_TODO_COUNT = 15;

export default function TodoList({
  data,
  showCompleted,
  onSwitchCompleted,
  onEditable,
  onEditCompleted,
  onCreateCompleted
}) {
  let emptyTodos = [];

  for (let i = 1; i < MIN_TODO_COUNT - data.length; i++) {
    emptyTodos.push(<EmptyTodo key={`e_${i}`} />);
  }

  return (
    <ul className="todo-list">
      {data
        ? data.map(({ id, content, completed, editable }) => (
            <li key={id}>
              <Todo
                editable={editable}
                content={content}
                completed={completed}
                onSwitchCompleted={v =>
                  onSwitchCompleted && onSwitchCompleted(id, v)
                }
                onEditable={() => onEditable && onEditable(id)}
                onEditCompleted={content =>
                  onEditCompleted && onEditCompleted(id, content)
                }
              />
            </li>
          ))
        : null}
      <li key="new">
        <NewTodo onCreateCompleted={onCreateCompleted} />
      </li>
      {emptyTodos}
    </ul>
  );
}
