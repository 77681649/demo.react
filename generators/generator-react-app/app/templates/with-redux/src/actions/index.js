import { bindActionCreators } from "redux";
import actionTypes from "../actionTypes";
import store from "../appStore";

export default bindActionCreators(
  {
    increment: () => ({ type: actionTypes.INCREMENT })
  },
  store.dispatch
);
