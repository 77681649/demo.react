import React from "react";

export default ({ todo, onDelete }) => {
  return (
    <div>
      <span>{todo.text}</span>&nbsp;
      <button onClick={onDelete.bind(null, todo.id)}>delete</button>
    </div>
  );
};
