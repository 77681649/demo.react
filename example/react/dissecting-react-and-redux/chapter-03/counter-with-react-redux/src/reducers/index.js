import actionTypes from "../actionTypes";

export default function rootReducer(state, action) {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return state + 1;
    default:
      return state || 0;
  }
}
