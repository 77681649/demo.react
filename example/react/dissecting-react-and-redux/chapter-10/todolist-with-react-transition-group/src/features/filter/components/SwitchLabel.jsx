import React from "react";
import "./SwitchLabel.css";

export default ({ text, onClick }) => {
  return (
    <div className="swtich-label" onClick={onClick}>
      {text}
    </div>
  );
};
