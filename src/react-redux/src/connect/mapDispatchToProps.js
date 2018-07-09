import { bindActionCreators } from "redux";
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from "./wrapMapToProps";

/**
 *
 * @param {*} mapDispatchToProps
 */
export function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === "function"
    ? wrapMapToPropsFunc(mapDispatchToProps, "mapDispatchToProps")
    : undefined;
}

/**
 *
 * @param {*} mapDispatchToProps
 */
export function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps
    ? wrapMapToPropsConstant(dispatch => ({ dispatch }))
    : undefined;
}

/**
 *
 * @param {*} mapDispatchToProps
 */
export function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === "object"
    ? wrapMapToPropsConstant(dispatch =>
        bindActionCreators(mapDispatchToProps, dispatch)
      )
    : undefined;
}

export default [
  whenMapDispatchToPropsIsFunction,
  whenMapDispatchToPropsIsMissing,
  whenMapDispatchToPropsIsObject
];
