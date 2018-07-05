import { bindActionCreators } from "redux";
import store from "./appStore";
import actionTypes from "./actionTypes";

export default bindActionCreators(
  {
    increment: index => ({
      type: actionTypes.INCREMENT,
      index
    }),
    decrement: index => ({
      type: actionTypes.DECREMENT,
      index
    })
  },
  store.dispatch
);
