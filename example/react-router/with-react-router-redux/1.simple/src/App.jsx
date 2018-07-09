import React, { Component } from "react";
import { Provider } from "react-redux";
import { Link, Switch, Router, Route } from "react-router-dom";
import IndexPage from "./containers/IndexPage";
import ListPage from "./containers/ListPage";
import AboutPage from "./containers/AboutPage";
import store, { history } from "./appStore";
import { ConnectedRouter, push } from "react-router-redux";

store.subscribe(() => {
  console.log("Current Router State", store.getState().location);
});

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.Fragment>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Index</Link>
              </li>
              <li>
                <Link to="/list">List</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/" exact component={IndexPage} />
            <Route path="/list" component={ListPage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </main>
      </React.Fragment>
    </ConnectedRouter>
  </Provider>
);
