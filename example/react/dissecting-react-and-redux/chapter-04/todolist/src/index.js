import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const { registerObserver } = require("react-perf-devtool");
const options = {
  shouldLog: true,
  port: 3000,
  components: ["App"] // Assuming you've these components in your project
};

registerObserver(options);

ReactDOM.render(<App />, document.getElementById("root"));
