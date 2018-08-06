import defaultHandleActions from './handleActions';

/**
 * 创建reducer
 * @param {Object|Array} reducers reducer片段
 * @param {Any} state reducer的默认状态
 * @param {Function} handleActions 生成reducer的逻辑
 * @returns {Function} 返回一个root reducer
 */
export default function getReducer(reducers, state, handleActions) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1](
      (handleActions || defaultHandleActions)(reducers[0], state)
    );
  } else {
    return (handleActions || defaultHandleActions)(reducers || {}, state);
  }
}
