import { combineReducers } from "redux";
import { reducer as filterReducer } from "./features/filter";
import { reducer as todolistReducer } from "./features/todolist";

export default combineReducers({
  filter: filterReducer,
  todolist: todolistReducer
});
