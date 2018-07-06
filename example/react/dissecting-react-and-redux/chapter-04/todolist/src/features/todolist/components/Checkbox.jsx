import React from "react";
import "./Checkbox.css";

export default ({ id, disabled, checked, text, onChange, children }) => {
  return (
    <div className="checkbox">
      <input
        id={id}
        type="checkbox"
        className="raw"
        onChange={onChange}
        disabled={disabled}
        checked={checked}
      />
      <label htmlFor={id}>{text || children}</label>
    </div>
  );
};
