import React from "react";
import NavBar from "./components/NavBar";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./app-store";

import { Switch, Route } from "react-router-dom";
import Home from "./components/HomeTitle";
import About from "./components/AboutTitle";
import NotFound from "./components/NotFoundTitle";

export default ({ path }) => {
  history.push(path);
  
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <React.Fragment>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="*" component={NotFound} />
          </Switch>
        </React.Fragment>
      </ConnectedRouter>
    </Provider>
  );
};
