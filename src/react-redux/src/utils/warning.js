/**
 * console存在的情况下, 在控制台打印警告
 *
 * @param {String} message 警告信息
 * @returns {void}
 */
export default function warning(message) {
  // 判断console.error是否存在, 存在就在控制台打印错误
  /* eslint-disable no-console */
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  /* eslint-enable no-console */

  // 如果不存在就抛出错误
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
