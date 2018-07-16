import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const Home = () => <h4>Home</h4>;

const About = () => <h4>About</h4>;

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
        <OldSchoolMenuLink to="/">Home</OldSchoolMenuLink>
      </li>
      <li>
        <OldSchoolMenuLink to="/about">About</OldSchoolMenuLink>
      </li>
    </ul>
  </nav>
);

const App = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBar />
      <hr />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
