const path = require("path");
const fs = require("fs");
const express = require("express");

require("babel-register")(
  JSON.parse(fs.readFileSync(path.join(__dirname, "./.babelrc")))
);

const registerRoutes = require("./register-server-routes").default;

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

registerRoutes(app);

app.listen(3000, function() {
  console.log("dev-server started.");
});
