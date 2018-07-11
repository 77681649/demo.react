import { combineReducers } from "redux";
import citylistReducer from "./citylist";
import weatherReducer from "./weather";

export default combineReducers({
  citylist: citylistReducer,
  weather: weatherReducer
});
