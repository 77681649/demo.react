import React, { Component } from "react";
import { Motion, spring } from "react-motion";

export default () => {
  return (
    <Motion
      defaultStyle={{ x: 100 }}
      style={{
        x: spring(0, { stiffness: 100, damping: 100 })
      }}
    >
      {value => {
        return <div>{Math.ceil(value.x)}</div>;
      }}
    </Motion>
  );
};
