const fs = require("fs");
const path = require("path");

require("babel-register")(
  JSON.parse(fs.readFileSync(path.join(__dirname, "./.babelrc")))
);

require("./app.js");
