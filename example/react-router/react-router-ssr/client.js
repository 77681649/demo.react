import React from "react";
import ReactDOM from "react-dom";
import createClientRouter from "./routes/create-client-router";
import createApp from "./create-app";

const App = createApp(createClientRouter());

ReactDOM.hydrate(<App />, document.getElementById("root"));
