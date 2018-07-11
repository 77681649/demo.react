import React, { Component } from "react";
import store from "./appStore";
import { Provider } from "react-redux";
import CitySelector from "./containers/CitySelector";
import Weather from "./containers/Weather";

export default () => (
  <Provider store={store}>
    <div>
      <div>
        <CitySelector />
      </div>
      <div>
        <Weather />
      </div>
    </div>
  </Provider>
);
