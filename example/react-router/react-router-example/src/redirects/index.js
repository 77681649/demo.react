import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Redirect,
  BrowserRouter,
  Route,
  Link,
  Switch,
  withRouter
} from "react-router-dom";

const LoginBanner = withRouter(({ history, logined, onSignout }) => {
  return logined ? (
    <div>
      Welcome!{" "}
      <button onClick={() => onSignout(() => history.push("/"))}>
        Sign out
      </button>
    </div>
  ) : (
    <div>You are not logged in.</div>
  );
});

const Public = () => <div>Public</div>;

const Protected = () => <div>Protected</div>;

const Login = withRouter(({ history, location, onSignin }) => {
  return (
    <div>
      <div>You must log in to view the page at /protected</div>
      <div>
        <button
          onClick={() =>
            onSignin(() => history.push(location.state.from.pathname))
          }
        >
          Log in
        </button>
      </div>
    </div>
  );
});

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <Link to="/public">Public Page</Link>
      </li>
      <li>
        <Link to="/protected">Protected Page</Link>
      </li>
    </ul>
  </nav>
);

const PrivateRoute = ({ logined, location, onSignin, path, ...others }) => {
  return logined ? (
    <Route path={path} {...others} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: {
          from: location
        }
      }}
    />
  );
};

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSingin = this.handleSingin.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }

  state = {
    logined: false
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <LoginBanner
            logined={this.state.logined}
            onSignout={this.handleSignout}
          />
          <NavBar />
          <Switch>
            <Route path="/" exact />
            <Route path="/public" component={Public} />
            <PrivateRoute
              path="/protected"
              component={Protected}
              logined={this.state.logined}
            />
            <Route
              path="/login"
              render={() => {
                return <Login onSignin={this.handleSingin} />;
              }}
            />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }

  handleSignout(callback) {
    setTimeout(() => {
      this.setState({ logined: false }, callback);
    }, 100);
  }

  handleSingin(callback) {
    setTimeout(() => {
      this.setState({ logined: true }, callback);
    }, 100);
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
