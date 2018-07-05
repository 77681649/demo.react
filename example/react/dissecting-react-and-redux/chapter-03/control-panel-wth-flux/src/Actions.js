import actionTypes from "./AcionTypes";
import appDispatcher from "./AppDispatcher";

export const increment = index => {
  appDispatcher.dispatch({
    type: actionTypes.INCREMENT,
    index
  });
};

export const decrement = index => {
  appDispatcher.dispatch({
    type: actionTypes.DECREMENT,
    index
  });
};
