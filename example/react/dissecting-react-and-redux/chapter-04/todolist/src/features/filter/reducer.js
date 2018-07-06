import { SWITCH_COMPLETED } from "./actionTypes";

const INIT_STATE = {
  showCompleted: false
};

export default function filterReducer(state, action) {
  switch (action.type) {
    case SWITCH_COMPLETED:
      return { showCompleted: !state.showCompleted };
    default:
      return state || INIT_STATE;
  }
}
