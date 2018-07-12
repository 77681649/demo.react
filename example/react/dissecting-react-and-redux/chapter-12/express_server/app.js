const path = require("path");
const express = require("express");

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Home = require("./src/components/HomeTitle");
const About = require("./src/components/AboutTitle");
const NotFound = require("./src/components/NotFoundTitle");
const App = require("./src/ServerApp");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    content: ReactDOMServer.renderToString(
      React.createElement(App.default, {
        path: "/"
      })
    )
  });
});

app.get("/about", (req, res) => {
  res.render("index", {
    content: ReactDOMServer.renderToString(
      React.createElement(App.default, {
        path: "/about"
      })
    )
  });
});

app.use(function(req, res, next) {
  res.render("index", {
    content: ReactDOMServer.renderToString(
      React.createElement(App.default, {
        path: "/not-found"
      })
    )
  });
});

app.listen(3000, function() {
  console.log("dev-server started.");
});
