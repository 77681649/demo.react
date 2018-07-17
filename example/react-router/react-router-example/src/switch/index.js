import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  NavLink
} from "react-router-dom";
import "./index.css";

const withLog = WrapedComponent => ({ match, location, ...rest }) => {
  console.log("match", match);
  console.log("location", location);

  return <WrapedComponent match={match} location={location} {...rest} />;
};
const Home = withLog(() => <h4>Home</h4>);
const Articles = withLog(() => (
  <div>
    <h4>Articles</h4>
    <ul>
      <li>
        <Link to="/post/1">深入浅出React</Link>
      </li>
      <li>
        <Link to="/post/2">深入浅出React-Router</Link>
      </li>
      <li>
        <Link to="/post/3">深入浅出Redux</Link>
      </li>
    </ul>
  </div>
));
const Post = withLog(({ match }) => <h4>Post ID:{match.params.id}</h4>);
const About = withLog(() => <h4>About</h4>);
const NotFound = withLog(() => <h4>Not Found</h4>);

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
          <MenuItem to="/articles">Articles</MenuItem>
          <MenuItem to="/about">About</MenuItem>
          <MenuItem to="/contacts">Contacts</MenuItem>
        </Menu>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/articles" component={Articles} />
        <Route path="/post/:id" component={Post} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
      <Route path="xxx">{() => <h4>hahaha</h4>}</Route>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
