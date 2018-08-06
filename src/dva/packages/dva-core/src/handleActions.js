import invariant from 'invariant';

function identify(value) {
  return value;
}

/**
 * 创建一个处理指定ation.type的reducer
 * @param {String} actionType action.type
 * @param {Function} reducer action handler
 * @returns {Function} 返回处理指定action.type的reducer
 */
function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    invariant(type, 'dispatch: action should be a plain Object with type');
    
    // 如果是指定type, 调用reducer
    if (actionType === type) {
      return reducer(state, action);
    }

    // 否则, 返回state
    return state;
  };
}

/**
 * reduce reducers
 * @param {Function[]} reducers 一个或多个
 * @returns {Function} 返回wrap reduce
 */
function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce((p, r) => r(p, current), previous);
}

/**
 * 返回一个处理指定action的reducer
 * @param {Object} handlers  一个或多个action handler
 * @param {Any} defaultState 默认状态
 * @returns {Function} 返回一个root reducer
 */
function handleActions(handlers, defaultState) {
  // wrap handlerAction
  const reducers = Object.keys(handlers).map(type =>
    handleAction(type, handlers[type])
  );

  // reduce function
  const reducer = reduceReducers(...reducers);

  // 返回一个root reducer
  return (state = defaultState, action) => reducer(state, action);
}

export default handleActions;
