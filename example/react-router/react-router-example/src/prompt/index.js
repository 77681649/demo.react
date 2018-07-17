/**
 * prompt
 * 页面切换之前, 弹出自定义的对话框询问用户
 */
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Prompt
} from "react-router-dom";
import "./index.css";

class Dialog extends React.Component {
  render() {
    let { message, onClick } = this.props;
    onClick || (onClick = x => x);

    return (
      <div className="dialog-container">
        <div className="dialog">
          <div className="dialog-content">
            <span>{message}</span>
          </div>
          <div className="dialog-buttons">
            <button onClick={onClick.bind(null, "cancel")}>Cancel</button>
            <button onClick={onClick.bind(null, "ok")}>OK</button>
          </div>
        </div>
        <div className="mask-layer" />
      </div>
    );
  }
}

const Home = () => <h4>Home</h4>;
const Contacts = () => <h4>Contacts</h4>;
const About = () => <h4>About</h4>;

const Menu = ({ children }) => <ul className="menu">{children}</ul>;
const MenuItem = ({ to, children }) => (
  <li className="menu-item">
    <NavLink activeClassName="active" exact to={to}>
      {children}
    </NavLink>
  </li>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrompt = this.handlePrompt.bind(this);
  }

  state = {
    dialog: false,
    message: "",
    callback: null
  };

  render() {
    return (
      <Router
        getUserConfirmation={(message, callback) => {
          this.setState({
            dialog: true,
            message: message,
            callback: callback
          });
        }}
      >
        <React.Fragment>
          <Prompt when={true} message="离开当前页面?" />
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
          {this.state.dialog ? (
            <Dialog message={this.state.message} onClick={this.handlePrompt} />
          ) : null}
        </React.Fragment>
      </Router>
    );
  }

  handlePrompt(result) {
    let ok = result === "ok";
    let callback = this.state.callback;

    this.setState(
      {
        dialog: false,
        message: "",
        callback: null
      },
      () => callback(ok)
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
