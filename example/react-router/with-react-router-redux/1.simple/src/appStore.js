import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import reducer from "./reducers";

// 1. 创建一个history 对象
const history = createBrowserHistory();

// 2. 绑定routerReducer: 将更新的Location同步到store
const store = createStore(
  combineReducers({
    counter: reducer,
    router: routerReducer
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history)))
);

// 3. export history, 这是需要传递个Router的
export { history };
export default store;