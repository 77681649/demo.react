import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Link, Switch, Router, Route } from "react-router-dom";
import IndexPage from "./containers/IndexPage";
import ListPage from "./containers/ListPage";
import AboutPage from "./containers/AboutPage";
import store, { history } from "./appStore";
import { ConnectedRouter } from "connected-react-router";
import Counter from "./components/Counter";

const ConnectedCounter = connect(
  ({ counter }) => ({ value: counter }),
  dispatch => ({ onClick: () => dispatch({ type: "INCREMENT" }) })
)(Counter);

function Navigator({ goForward, goBack }) {
  return (
    <ul>
      <li>
        <a onClick={goForward}>goForward</a>
      </li>
      <li>
        <a onClick={goBack}>goBack</a>
      </li>
    </ul>
  );
}

const NavBar = () => {
  return (
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
  );
};

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <NavBar />
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/list" component={ListPage} />
          <Route path="/about" component={AboutPage} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>
);
