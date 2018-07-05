import actionTypes from "./AcionTypes";
import appDispatcher from "./AppDispatcher";

export default {
  increment: index => {
    appDispatcher.dispatch({
      type: actionTypes.INCREMENT,
      index
    });
  },
  decrement: index => {
    appDispatcher.dispatch({
      type: actionTypes.DECREMENT,
      index
    });
  }
};
