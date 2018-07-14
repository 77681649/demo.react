import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const NoSelectTopic = () => <div>Please select a topic.</div>;

const TopicRenderingWithReact = () => <div>rending</div>;

const TopicComponents = () => <div>components</div>;

const TopicPropsVSState = () => <div>props-v-state</div>;

const Home = () => <h4>Home</h4>;

const About = () => <h4>About</h4>;

const Topics = ({ match }) => (
  <React.Fragment>
    <h4>Home</h4>
    <ul>
      <li>
        <Link to={`${match.url}/render-with-react`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-vs-state`}>Props vs State</Link>
      </li>
    </ul>
    <Switch>
      <Route
        path={`${match.url}/render-with-react`}
        component={TopicRenderingWithReact}
      />
      <Route path={`${match.url}/components`} component={TopicComponents} />
      <Route
        path={`${match.url}/props-vs-state`}
        component={TopicPropsVSState}
      />
      <Route path={`${match.url}`} component={NoSelectTopic} />
    </Switch>
  </React.Fragment>
);

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/topics">Topics</Link>
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
        <Route path="/topics" component={Topics} />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
