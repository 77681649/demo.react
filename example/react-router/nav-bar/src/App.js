import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Menu from "./components/Menu";

const Home = () => <h4>Home</h4>;
const Contacts = () => <h4>Contacts</h4>;
const About = () => <h4>About</h4>;

export default class App extends Component {
  state = {
    current: ""
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  render() {
    return (
      <Router>
        <Route>
          {({ location }) => (
            <React.Fragment>
              <Menu onClick={this.handleClick} selectedKey={this.state.current || location.pathname}>
                <Menu.Item key="/" to="/">
                  Home
                </Menu.Item>
                <Menu.Item key="/contacts" to="/contacts">
                  Contacts
                </Menu.Item>
                <Menu.Item key="/about" to="/about">
                  About
                </Menu.Item>
              </Menu>

              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/contacts" component={Contacts} />
                <Route path="/about" component={About} />
              </Switch>
            </React.Fragment>
          )}
        </Route>
      </Router>
    );
  }
}
