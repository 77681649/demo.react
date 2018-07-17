import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink
} from "react-router-dom";
import "./index.css";

const withLog = WrapedComponent => ({ match, location, ...rest }) => {
  console.log("match", match);
  console.log("location", location);

  return <WrapedComponent match={match} location={location} {...rest} />;
};
const Home = () => withLog(<h4>Home</h4>);
const Contacts = () => withLog(<h4>Contacts</h4>);
const About = () => withLog(<h4>About</h4>);

const Menu = ({ children }) => <ul className="menu">{children}</ul>;
const MenuItem = ({ to, children }) => (
  <li className="menu-item">
    <NavLink activeClassName="active" exact to={to}>
      {children}
    </NavLink>
  </li>
);

const App = () => (
  <Router>
    <React.Fragment>
      <nav>
        <Menu>
          <MenuItem to="/">Home</MenuItem>
          <MenuItem to="/contacts">Contacts</MenuItem>
          <MenuItem to="/about">About</MenuItem>
        </Menu>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/about" component={About} />
      </Switch>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
