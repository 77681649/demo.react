import React from "react";
import ReactDOMServer from "react-dom/server";
import createServerRouter from "./routes/create-server-router";
import config from "./routes/config";
import createApp from "./create-app";

export default function registerServerRoutes(app) {
  const App = createApp(createServerRouter());

  const render = (Component, props, req, res) => {
    // debugger;
    res.render("index", {
      // content: ""
      content: ReactDOMServer.renderToString(
        React.createElement(Component, props)
      )
    });
  };

  config.forEach(({ path }) => {
    if (!path) {
      return;
    }

    app.get(path, (req, res) => {
      render(App, { location: path, context: {} }, req, res);
    });
  });

  config.forEach(({ path, component }) => {
    if (path) {
      return;
    }

    app.use(function(req, res, next) {
      render(component, null, req, res);
    });
  });
}
