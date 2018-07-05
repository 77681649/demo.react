import React, { Component } from "react";
import { Provider } from "react-redux";
// import store from "./appStore";

export default () => (
  // <Provider store={store}>
    <React.Fragment>
      <header>
        <h1>重要&&紧急</h1>
        <span>1</span>
      </header>
      <main>
        <ul>
          <li>
            <div><input type="radio" /></div>
            <div>域名备案</div>
          </li>
          <li>
            <div><input type="radio" /></div>
            <div>域名备案</div>
          </li>
          <li>
            <div>+</div>
            <div><input /></div>
          </li>
        </ul>
        </main>
      <footer>
        <div>
          <label>显示已完成的项目</label>
        </div>
      </footer>
    </React.Fragment>
  // </Provider>
);
