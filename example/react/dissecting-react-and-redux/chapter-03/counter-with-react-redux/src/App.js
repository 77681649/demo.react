import React, { Component } from "react";
import store from "./appStore";
import { Provider } from "react-redux";
import ConnectedCounter from "./containers/ConnectedCounter";

export default () => (
  <Provider store={store}>
    <ConnectedCounter />
  </Provider>
);
