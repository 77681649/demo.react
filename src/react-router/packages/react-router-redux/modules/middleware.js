import { CALL_HISTORY_METHOD } from "./actions";

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
export default function routerMiddleware(history) {
  return () => next => action => {
    // jump 不是 "CALL_HISTORY_METHOD"
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }

    const { payload: { method, args } } = action;
    
    // 调用history相关的方法
    // 这里不能调用next(actoin) -> dispatch(action)
    // 因为, 后续会触发"CALL_HISTORY_METHOD" action
    history[method](...args);
  };
}
