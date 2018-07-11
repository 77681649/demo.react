import React from "react";
import Bundle from "../components/Bundle";

export default props => {
  // 动态加载模块
  return (
    <Bundle
      load={() =>
        import(/* webpackChunkName: "home.title" */
        "../components/HomeTitle")
      }
    >
      {Title => <Title {...props} />}
    </Bundle>
  );
};
