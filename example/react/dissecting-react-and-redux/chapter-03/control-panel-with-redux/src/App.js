import React, { Component } from "react";
import ControlPanel from "./components/ControlPanel";
import { Provider } from "./react-redux";
import store from "./appStore";

export default () => {
  return (
    <Provider store={store}>
      <ControlPanel defaultValues={store.getState()} />
    </Provider>
  );
};
