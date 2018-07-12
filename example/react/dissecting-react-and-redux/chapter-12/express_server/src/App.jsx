import React from "react";
import Routes from "./Routes";
import NavBar from "./components/NavBar";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./app-store";
import HomeTitle from "./components/HomeTitle";

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

// const App = () => {
//   return (
//     <Provider store={store}>
//       <ConnectedRouter history={history}>
//         <Main />
//       </ConnectedRouter>
//     </Provider>
//   );
// };

const App = () => {
  return <HomeTitle />;
};

export default App;
