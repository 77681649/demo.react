import { createStore, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

// 创建一个history
const history = createBrowserHistory();

// 连接router reducer
const connectedRouter = connectRouter(history)(reducer);

export { history };
export default createStore(
  connectedRouter,
  // 添加router 中间件
  composeWithDevTools(applyMiddleware(routerMiddleware(history)))
);
