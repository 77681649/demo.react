import React from "react";

export default ({ text, onDeleteButtonClick }) => (
  <li className="todo">
    <div className="del-btn" onClick={onDeleteButtonClick}>
      x
    </div>
    <div className="content">{text}</div>
  </li>
);
