import dva from "dva";
import { delay } from "dva/saga";
import "./index.css";

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model({
  namespace: "counter",
  state: 0,
  reducers: {
    increment(state, action) {
      return ++state;
    },
    decrement(state, action) {
      return --state;
    }
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: "increment" });
    }
  }
});

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
