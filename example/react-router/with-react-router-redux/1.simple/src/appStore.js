import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const store = createStore(
  combineReducers({
    location: routerReducer
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history)))
);

export { history };
export default store;
