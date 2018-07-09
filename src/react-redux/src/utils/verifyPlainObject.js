import isPlainObject from "lodash/isPlainObject";
import warning from "./warning";

/**
 * 检查value是否是一个纯对象.如果不是,则抛出警告
 * @param {*} value
 * @param {string} displayName
 * @param {string} methodName
 * @returns {boolean} 返回是否是纯对象: true - 纯对象: false - 非纯对象
 */
export default function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning(
      `${methodName}() in ${displayName} must return a plain object. Instead received ${value}.`
    );
  }
}
