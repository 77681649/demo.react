import React from "react";
import { Route } from "react-router-dom";
import config from "./config";

export default function createRouter(Router) {
  let routes = config.map(({ path, ...other }) => (
    <Route key={path} path={path} {...other} />
  ));

  return {
    Router,
    routes
  };
}
