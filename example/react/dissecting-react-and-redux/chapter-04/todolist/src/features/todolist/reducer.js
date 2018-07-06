// import { SWITCH_COMPLETED } from "./actionTypes";

const INIT_STATE = {
  title: "hgahah",
  todos: [
    {
      editable: false,
      data: {
        id: 1,
        content: "哇哈哈哈哈哈哈",
        completed: false
      }
    },
    {
      editable: false,
      data: {
        id: 2,
        content: "哇哈哈哈",
        completed: true
      }
    }
  ]
};

export default function filterReducer(state, action) {
  switch (action.type) {
    // case SWITCH_COMPLETED:
    //   return { showCompleted: !state.showCompleted };
    default:
      return state || INIT_STATE;
  }
}
