import React from "react";
import Bundle from "../components/Bundle";

export default props => {
  // 动态加载模块
  return (
    <Bundle
      load={() =>
        import(/* webpackChunkName: "about.title" */ "../components/AboutTitle")
      }
    >
      {Title => <Title {...props} />}
    </Bundle>
  );
};
