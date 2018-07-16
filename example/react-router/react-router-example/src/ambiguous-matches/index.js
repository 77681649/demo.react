/**
 * animated-transitions
 *
 */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <Link to="/about">About Us (static)</Link>
      </li>
      <li>
        <Link to="/company">Company (static)</Link>
      </li>
      <li>
        <Link to="/kim">Kim (dynamic)</Link>
      </li>
      <li>
        <Link to="/chris">Chris (dynamic)</Link>
      </li>
    </ul>
  </nav>
);

const App = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBar />
      <hr />
      <Switch>
        <Route path="/" exact />
        <Route path="/about" render={() => <h4>About</h4>} />
        <Route path="/company" render={() => <h4>Company</h4>} />
        <Route
          path="/:user"
          render={({ match: { params } }) => `User:${params.user}`}
        />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
