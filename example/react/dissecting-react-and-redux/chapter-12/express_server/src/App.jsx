import React from "react";
import Routes from "./Routes";
import NavBar from "./components/NavBar";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./app-store";

// const Main = hot(module)(() => (
//   <React.Fragment>
//     <NavBar />
//     <Routes />
//   </React.Fragment>
// ));

const Main = () => (
  <React.Fragment>
    <NavBar />
    <Routes />
  </React.Fragment>
);

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Main />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
