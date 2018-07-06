import React from "react";
import "./Header.css";
import LinkButton from "./LinkButton";

export default ({ mainTitle, subTitle, showEditButton }) => {
  return (
    <div className="header">
      <div className="main-title">{mainTitle}</div>
      <div className="sub-title">
        <div className="text">{subTitle}</div>
        <div className="button">
          {showEditButton ? <LinkButton text="编辑" /> : null}
        </div>
      </div>
    </div>
  );
};
