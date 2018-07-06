import React from "react";
import './EditableTodoContent.css'

export default function EditableTodoContent({ content }) {
  return <input className="editable-todo-content" value={content} />;
}
