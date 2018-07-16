import React from "react";
import ReactDOM from "react-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import "./index.css";

const NavBar = () => (
  <ul className="navbar">
    <li className="nav-item">
      <Link to="/hsl/10/90/50">Red</Link>
    </li>
    <li className="nav-item">
      <Link to="/hsl/120/100/40">Green</Link>
    </li>
    <li className="nav-item">
      <Link to="/rgb/33/150/243">Blue</Link>
    </li>
    <li className="nav-item">
      <Link to="/rgb/240/98/146">Pink</Link>
    </li>
  </ul>
);

const Main = ({ bgColor }) => {
  return (
    <div className="bg" style={{ backgroundColor: bgColor }}>
      <div>{bgColor}</div>
    </div>
  );
};

const HSL = ({ match: { params } }) => {
  let bgColor = `hsl(${params.h},${params.s}%,${params.l}%)`;
  return <Main bgColor={bgColor} />;
};

const RGB = ({ match: { params } }) => {
  let bgColor = `rgb(${params.r},${params.g},${params.b})`;
  return <Main bgColor={bgColor} />;
};

const duration = 500;

const Routes = () => (
  <Route
    render={({ location }) => (
      <React.Fragment>
        <Route
          path="/"
          exact
          render={() => <Redirect exact from="/" to="/hsl/10/90/50" />}
        />

        <TransitionGroup>
          <CSSTransition
            key={location.key}
            appear
            classNames="fade"
            timeout={duration}
          >
            <Switch location={location}>
              <Route path="/hsl/:h/:s/:l" component={HSL} />
              <Route path="/rgb/:r/:g/:b" component={RGB} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </React.Fragment>
    )}
  />
);

const App = () => (
  <Router>
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <Routes />
      </main>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
