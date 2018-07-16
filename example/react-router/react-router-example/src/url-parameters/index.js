import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const Accounts = ({ match }) => <div>ID:{match.params.id}</div>;

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <Link to="/netflix">Netflix</Link>
      </li>
      <li>
        <Link to="/zillow-group">Zillow Group</Link>
      </li>
      <li>
        <Link to="/yahoo">Yahoo</Link>
      </li>
      <li>
        <Link to="/modus-create">Modus Create</Link>
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
        <Route path="/" exact render={() => ""} />
        <Route path="/:id" component={Accounts} />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
