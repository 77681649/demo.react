import React from "react";
import { Switch } from "react-router-dom";
import NavBar from "./components/NavBar";

export default ({ Router, routes }) => ({ location, context }) => (
  <Router location={location} context={context}>
    <div style={{ background: "#eee", width: "400px", height: "400px" }}>
      <NavBar />
      <Switch>{routes}</Switch>
    </div>
  </Router>
);
