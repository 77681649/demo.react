import { bindActionCreators } from "redux";

/**
 *
 * @param {*} actionCreators
 */
export default function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch);
}
