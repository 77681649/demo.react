/**
 * PropTypes
 * react-redux 自定义的组件属性类型
 */

import PropTypes from "prop-types";

/**
 * store订阅 数据结构
 */
export const subscriptionShape = PropTypes.shape({
  trySubscribe: PropTypes.func.isRequired,
  tryUnsubscribe: PropTypes.func.isRequired,
  notifyNestedSubs: PropTypes.func.isRequired,
  isSubscribed: PropTypes.func.isRequired
});

/**
 * store 数据结构
 */
export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});
