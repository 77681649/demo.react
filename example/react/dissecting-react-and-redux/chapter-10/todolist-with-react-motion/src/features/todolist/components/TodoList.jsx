import React from "react";
import NewTodo from "./NewTodo";
import EmptyTodo from "./EmptyTodo";
import Todo from "./Todo";
import { TransitionMotion, spring } from "react-motion";
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
  let willEnter = () => {
    return {
      height: 100,
      opacity: 0
    };
  };
  let willLeave = () => {
    return {
      height: 0,
      opacity: spring(0)
    };
  };
  let styles = data
    ? data.map(todo => {
        return {
          key: todo.id.toString(),
          data: todo,
          style: {
            height: spring(60),
            opacity: spring(1)
          }
        };
      })
    : null;

  for (let i = 1; i < MIN_TODO_COUNT - data.length; i++) {
    emptyTodos.push(<EmptyTodo key={`e_${i}`} />);
  }

  return (
    <TransitionMotion
      willEnter={willEnter}
      willLeave={willLeave}
      styles={styles}
    >
      {interpolatedStyles => {
        return (
          <ul className="todo-list">
            {interpolatedStyles
              ? interpolatedStyles.map(
                  ({
                    key,
                    data: { id, content, completed, editable },
                    style
                  }) => (
                    <li key={key}>
                      <Todo
                        editable={editable}
                        content={content}
                        completed={completed}
                        style={style}
                        onSwitchCompleted={v =>
                          onSwitchCompleted && onSwitchCompleted(id, v)
                        }
                        onEditable={() => onEditable && onEditable(id)}
                        onEditCompleted={content =>
                          onEditCompleted && onEditCompleted(id, content)
                        }
                      />
                    </li>
                  )
                )
              : null}

            <li key="new">
              <NewTodo onCreateCompleted={onCreateCompleted} />
            </li>
            {emptyTodos}
          </ul>
        );
      }}
    </TransitionMotion>
  );
}
