import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const routes = [
  {
    path: "/",
    title: "Home",
    sidebar: <div>home!</div>,
    main: <h4>Home</h4>
  },
  {
    path: "/bubblegum",
    title: "Bubblegum",
    sidebar: <div>bubblegum!</div>,
    main: <h4>Bubblegum</h4>
  },
  {
    path: "/shoelaces",
    title: "Shoelaces",
    sidebar: <div>shoelaces!</div>,
    main: <h4>Shoelaces</h4>
  }
];

const NavBar = ({ routes }) => (
  <ul style={{ listStyle: "none" }}>
    {routes.map(({ path, title }) => (
      <li key={path}>
        <Link to={path}>{title}</Link>
      </li>
    ))}
  </ul>
);

const Sidebar = ({ routes }) => (
  <div style={{ background: "#ddd", padding: "10px", marginRight: "10px" }}>
    <NavBar routes={routes} />
    <Switch>
      {routes.map(({ path, sidebar }) => (
        <Route key={path} path={path} exact>
          {() => sidebar}
        </Route>
      ))}
    </Switch>
  </div>
);

const Main = ({ routes }) => (
  <div style={{ flex: "1" }}>
    <Switch>
      {routes.map(({ path, main }) => (
        <Route key={path} path={path} exact>
          {() => main}
        </Route>
      ))}
    </Switch>
  </div>
);

const App = () => (
  <Router>
    <div style={{ display: "flex" }}>
      <Sidebar routes={routes} />
      <Main routes={routes} />
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
