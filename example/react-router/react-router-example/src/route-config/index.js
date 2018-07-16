/**
 * route-config
 * 静态路由配置:
 * 根据路由配置, 生成组件
 */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const routes = [
  {
    text: "Tacos",
    path: "tacos",
    routes: [
      {
        text: "Bus",
        path: "bus",
        render: () => <h4>Bus</h4>
      },
      {
        text: "Cart",
        path: "cart",
        render: () => <h4>Cart</h4>
      }
    ]
  },
  {
    text: "Sandwiches",
    path: "sandwiches",
    render: () => <h4>Sandwiches</h4>
  }
];

const Routes = ({ rootPath, routes }) => {
  rootPath = rootPath === "/" ? "" : rootPath;

  return (
    <div>
      <Route
        exact
        render={() => (
          <ul>
            {routes.map(({ text, path }) => {
              path = `${rootPath}/${path}`;

              return (
                <li key={path}>
                  <Link to={path}>{text}</Link>
                </li>
              );
            })}
          </ul>
        )}
      />

      <Switch>
        {routes.map(({ path, render, routes }) => {
          path = `${rootPath}/${path}`;

          return (
            <Route
              key={path}
              path={path}
              render={
                render
                  ? render
                  : () => <Routes rootPath={path} routes={routes} />
              }
            />
          );
        })}
      </Switch>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes rootPath="/" routes={routes} />
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
