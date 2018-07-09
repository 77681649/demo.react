import React from "react";
import Todo from "./Todo";

const TodoList = ({ todos, onTodoDelete }) => {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Todo todo={todo} onDelete={onTodoDelete} />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
