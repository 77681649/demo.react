/**
 * mapStateProps
 * 负责默认的工厂方法
 */

import { wrapMapToPropsConstant, wrapMapToPropsFunc } from "./wrapMapToProps";

/**
 *
 * @param {*} mapStateToProps
 */
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === "function"
    ? wrapMapToPropsFunc(mapStateToProps, "mapStateToProps")
    : undefined;
}

/**
 *
 * @param {*} mapStateToProps
 */
export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined;
}

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
