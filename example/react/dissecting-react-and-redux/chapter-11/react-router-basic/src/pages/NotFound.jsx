import React from "react";
import Bundle from "../components/Bundle";

export default props => {
  // 动态加载模块
  return (
    <Bundle
      load={() =>
        import(/* webpackChunkName: "not.found.title" */
        "../components/NotFoundTitle")
      }
    >
      {Title => <Title {...props} />}
    </Bundle>
  );
};
