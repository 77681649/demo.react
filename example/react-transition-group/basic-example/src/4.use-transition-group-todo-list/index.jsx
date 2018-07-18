import React from "react";
import ReactDOM from "react-dom";
import Todos from "./components/Todos";
import "./index.css";

const App = () => (
  <div className="main">
    <Todos />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
