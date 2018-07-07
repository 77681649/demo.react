import React from "react";
import "./EditableTodoContent.css";

export default React.forwardRef(function EditableTodoContent(
  { content, onBlur, onChange, onKeyDown },
  ref
) {
  return (
    <input
      ref={ref}
      className="editable-todo-content"
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={content}
    />
  );
});
