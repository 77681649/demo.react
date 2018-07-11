import React from "react";
import NewTodo from "./NewTodo";
import EmptyTodo from "./EmptyTodo";
import Todo from "./Todo";
import TransitionGroup from "react-addons-css-transition-group";
import "./TodoList.css";

const MIN_TODO_COUNT = 15;

export default function TodoList({
  data,
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
      <TransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={200}
      >
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
      </TransitionGroup>
      <li key="new">
        <NewTodo onCreateCompleted={onCreateCompleted} />
      </li>
      {emptyTodos}
    </ul>
  );
}
