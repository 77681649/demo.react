import React, { Component } from "react";
import { Provider } from "react-redux";
import { Header, TodoList } from "./features/todolist";
import { Filter } from "./features/filter";
import store from "./appStore";

export default () => (
  <Provider store={store}>
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <TodoList />
      </main>
      <footer>
        <Filter />
      </footer>
    </React.Fragment>
  </Provider>
);
