/**
 * static-router-context
 * 使用StaticRouter context 传递数据
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { StaticRouter as Router, Route } from "react-router-dom";

const RouteStatus = ({ statucCode, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.statusCode = statucCode;

        return <div>{children}</div>;
      }
    }}
  />
);
const PrintContext = ({ context }) => (
  <div>Static context: {JSON.stringify(context)})</div>
);

class App extends Component {
  staticContext = {};

  render() {
    return (
      <Router location="/foo" context={this.staticContext}>
        <div>
          <RouteStatus statucCode={404}>
            <p>Route with statusCode 404</p>
            <PrintContext context={this.staticContext} />
          </RouteStatus>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
