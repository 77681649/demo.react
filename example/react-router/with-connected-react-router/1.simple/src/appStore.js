import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import reducer from "./reducers";

const rootReducer = combineReducers({
  counter: reducer
});

// 1. create history object
const history = createBrowserHistory();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  // 2.
  connectRouter(history)(rootReducer),

  // 3.
  composeEnhancer(applyMiddleware(routerMiddleware(history)))
);

// 4. export history
export { history };
export default store;
