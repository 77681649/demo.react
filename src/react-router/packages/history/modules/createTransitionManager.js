import warning from 'warning'

/**
 * TransitionManager 工厂方法
 * @returns {TransitionManager} 返回一个TransitionManager对象
 */
const createTransitionManager = () => {
  let prompt = null

  /**
   * 设置"提示"  - 同一时刻只能有一个提示框
   */
  const setPrompt = (nextPrompt) => {
    warning(
      prompt == null,
      'A history supports only one prompt at a time'
    )

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt)
        prompt = null
    }
  }

  /**
   * 提交location变换
   * @param {Location} location location nextLocation
   * @param {String} action Action 触发的动作
   * @param {Function} getUserConfirmation 获得用户的确认( 默认是通过弹出确认框实现 )
   * @param {Function} callback 回调函数 - 当得到用户确认之后触发
   */
  const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      // 
      const result = typeof prompt === 'function' ? prompt(location, action) : prompt
      
      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback)
        } else {
          warning(
            false,
            'A history needs a getUserConfirmation function in order to use a prompt message'
          )

          callback(true)
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false)
      }
    } else {
      callback(true)
    }
  }

  /**
   * 订阅者
   */
  let listeners = []

  /**
   * 追加订阅者
   * @param {Function} fn 函数
   */
  const appendListener = (fn) => {
    let isActive = true

    const listener = (...args) => {
      if (isActive)
        fn(...args)
    }

    listeners.push(listener)

    // 返回 unscribe
    return () => {
      isActive = false
      listeners = listeners.filter(item => item !== listener)
    }
  }

  /**
   * 通知订阅者
   * @param {any} ...args 参数
   */
  const notifyListeners = (...args) => {
    listeners.forEach(listener => listener(...args))
  }

  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  }
}

export default createTransitionManager
