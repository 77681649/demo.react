/**
 * 提供DOM相关的工具方法
 */



/**
 * 判断当前环境下, DOM API是否可用
 */
export const canUseDOM = !!(
  typeof window !== 'undefined' && window.document && window.document.createElement
)

/**
 * 
 * @param {Node} node 
 * @param {String} event 
 * @param {Function} listener 
 */
export const addEventListener = (node, event, listener) =>
  node.addEventListener
    ? node.addEventListener(event, listener, false)
    : node.attachEvent('on' + event, listener)

/**
 * 
 * @param {Node} node 
 * @param {String} event 
 * @param {Function} listener 
 */
export const removeEventListener = (node, event, listener) =>
  node.removeEventListener
    ? node.removeEventListener(event, listener, false)
    : node.detachEvent('on' + event, listener)

/**
 * 获得用户的确认( 默认是通过弹出确认框实现 )
 * @param {String} message 消息
 * @param {Function} callback 回调函数 - 收到通知之后调用
 */
export const getConfirmation = (message, callback) =>
  callback(window.confirm(message)) // eslint-disable-line no-alert

/**
 * 判断是否支持HTML history API
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
export const supportsHistory = () => {
  const ua = window.navigator.userAgent

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false

  return window.history && 'pushState' in window.history
}

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
export const supportsPopStateOnHashChange = () =>
  window.navigator.userAgent.indexOf('Trident') === -1

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 * 执行go(n)时, 是否支持无刷新
 * @returns {Boolean} true - 无刷新; false - 有刷新
 */
export const supportsGoWithoutReloadUsingHash = () =>
  window.navigator.userAgent.indexOf('Firefox') === -1

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
export const isExtraneousPopstateEvent = event =>
  event.state === undefined &&
  navigator.userAgent.indexOf('CriOS') === -1
