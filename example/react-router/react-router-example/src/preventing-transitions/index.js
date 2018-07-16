import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch, Prompt } from "react-router-dom";

const Form = ({ value, onInputChange, onSubmit }) => {
  return (
    <div>
      <div>
        Blocking? {value ? "Yes, click a link or the back button" : "Nope"}
      </div>
      <input
        value={value}
        onChange={onInputChange}
        size="50"
        placeholder="type something to block transitions"
      />
      <div>
        <button onClick={onSubmit}>Submit to stop blocking</button>
      </div>
    </div>
  );
};

const One = () => <h4>One</h4>;

const Two = () => <h4>Two</h4>;

const OldSchoolMenuLink = ({ to, children }) => {
  return (
    <Route exact path={to}>
      {({ match }) => (
        <div>
          {match ? "> " : ""}
          <Link to={to}>{children}</Link>
        </div>
      )}
    </Route>
  );
};

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <OldSchoolMenuLink to="/">Form</OldSchoolMenuLink>
      </li>
      <li>
        <OldSchoolMenuLink to="/one">One</OldSchoolMenuLink>
      </li>
      <li>
        <OldSchoolMenuLink to="/two">two</OldSchoolMenuLink>
      </li>
    </ul>
  </nav>
);

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Prompt
            when={!!this.state}
            message={location =>
              `Are you sure you want to go to ${location.pathname}`
            }
          />
          <NavBar />
          <hr />
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return (
                  <Form
                    value={this.state.value}
                    onInputChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                  />
                );
              }}
            />
            <Route path="/one" component={One} />
            <Route path="/two" component={Two} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit() {
    this.setState({ value: "" });
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
