import { delay } from "dva/saga";

let nextId = 1;

export default {
  namespace: "todos",

  state: [],

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *delayDelete({ id }, { call, put }) {
      // eslint-disable-line
      yield call(delay, 1000);
      yield put({ type: "delete", id });
    }
  },

  reducers: {
    add(state, action) {
      return [...state, { id: nextId++, text: action.text }];
    },

    delete(state, action) {
      return state.filter(todo => todo.id !== action.id);
    }
  }
};
