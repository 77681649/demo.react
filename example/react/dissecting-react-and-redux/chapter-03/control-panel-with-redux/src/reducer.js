import actionTypes from "./actionTypes";

export default function rootReducer(state, action) {
  switch (action.type) {
    case actionTypes.INCREMENT:
      state[action.index]++;
      return [].concat(state);
    case actionTypes.DECREMENT:
      state[action.index]--;
      return [].concat(state);
    default:
      return state || [0, 0, 0];
  }
}
