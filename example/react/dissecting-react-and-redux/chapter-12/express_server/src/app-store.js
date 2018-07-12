import { createStore, applyMiddleware } from "redux";
import { createBrowserHistory, createMemoryHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

// 创建一个history
const history =
  typeof ONCLIENT !== "undefined"
    ? createBrowserHistory()
    : createMemoryHistory({
      initialEntries:[
        '/',
        '/about'
      ]
    });

// 连接router reducer
const connectedRouter = connectRouter(history)(reducer);

export { history };
export default createStore(
  connectedRouter,
  // 添加router 中间件
  composeWithDevTools(applyMiddleware(routerMiddleware(history)))
);
