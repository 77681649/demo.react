import warning from 'warning'
import invariant from 'invariant'
import { createLocation, locationsAreEqual } from './LocationUtils'
import {
  addLeadingSlash,
  stripLeadingSlash,
  stripTrailingSlash,
  hasBasename,
  stripBasename,
  createPath
} from './PathUtils'
import createTransitionManager from './createTransitionManager'
import {
  canUseDOM,
  addEventListener,
  removeEventListener,
  getConfirmation,
  supportsGoWithoutReloadUsingHash
} from './DOMUtils'

const HashChangeEvent = 'hashchange'

/**
 * hash path 编码/解码器
 */
const HashPathCoders = {
  // hash = !/home
  hashbang: {
    encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
    decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
  },

  // hash = home
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },

  // hash = /home
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}

/**
 * 获得location.hash
 * 
 * @example
 * window.location.href = "baidu.com/1#tag"
 * 
 * // -> tag
 * getHashPath()
 * 
 * @returns {String}
 */
const getHashPath = () => {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

/**
 * 新增访问记录
 * 对window.location的都会导致history stack 增加
 * @param {String} path 
 */
const pushHashPath = (path) =>
  window.location.hash = path

/**
 * 用path替换window.location.href.hash
 * 
 * @example
 * window.location.href = "baidu.com/1#tag"
 * 
 * // -> window.location.href = "baidu.com/1#hello"
 * replaceHashPath('hello')
 * 
 * @param {String} path 
 */
const replaceHashPath = (path) => {
  const hashIndex = window.location.href.indexOf('#')

  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

/**
 * 创建 hash history
 * @param {*} props 
 */
const createHashHistory = (props = {}) => {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  /**
   * global history 
   */
  const globalHistory = window.history

  /**
   * go(n) 支持无刷新跳转
   */
  const canGoWithoutReload = supportsGoWithoutReloadUsingHash()

  const {
    getUserConfirmation = getConfirmation,
    hashType = 'slash'
  } = props

  /**
   * basename, 格式: /<basename>
   */
  const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : ''

  const { 
    encodePath, 
    decodePath 
  } = HashPathCoders[hashType]

  /** 
   * DOMLocation - 根据location.hash,创建的location对象
   * 
   * @example
   * http://baidu.com/1/t?a=1#tag
   * 
   * // -> { hash: '#hash' }
   * getDOMLocation()
   * 
   * @returns {Location} 返回location对象
   */
  const getDOMLocation = () => {
    // hash path
    let path = decodePath(getHashPath())

    warning(
      (!basename || hasBasename(path, basename)),
      'You are attempting to use a basename on a page whose URL path does not begin ' +
      'with the basename. Expected path "' + path + '" to begin with "' + basename + '".'
    )

    if (basename)
      path = stripBasename(path, basename)

    return createLocation(path)
  }

  /** 
   * 
   */
  const transitionManager = createTransitionManager()

  /**
   * 
   * @param {*} nextState 
   */
  const setState = (nextState) => {
    // 更新状态
    Object.assign(history, nextState)

    // 更新状态
    history.length = globalHistory.length

    // 通知订阅者,访问位置有变换
    transitionManager.notifyListeners(
      history.location,
      history.action
    )
  }

  /**
   * 
   */
  let forceNextPop = false

  /**
   * 记录被忽略的path - 为了避免 push(path) 的path被处理多次
   * location.replace() 会触发 hashchange
   */
  let ignorePath = null

  /**
   * 处理 hashchange 事件 - 当hash发生变化时触发 ( 浏览器端发生变化 )
   */
  const handleHashChange = () => {
    // hash path: tag
    const path = getHashPath()

    // encode: /tag
    const encodedPath = encodePath(path)

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath)
    } else {
      // 新的location - 来自浏览器的location
      const location = getDOMLocation()

      // 旧的location
      const prevLocation = history.location

      // 判断location是否发生变化
      if (!forceNextPop && locationsAreEqual(prevLocation, location))
        return // A hashchange doesn't always == location change.

      // 判断是否被忽略的path
      if (ignorePath === createPath(location))
        return // Ignore this change; we already setState in push/replace.

      ignorePath = null

      handlePop(location)
    }
  }

  /**
   * 处理"POP"
   * @param {Location} location
   */
  const handlePop = (location) => {
    if (forceNextPop) {
      forceNextPop = false
      setState()
    } else {
      const action = 'POP'

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
        if (ok) {
          setState({ action, location })
        } else {
          revertPop(location)
        }
      })
    }
  }

  /**
   * 
   */
  const revertPop = (fromLocation) => {
    const toLocation = history.location

    // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    let toIndex = allPaths.lastIndexOf(createPath(toLocation))

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allPaths.lastIndexOf(createPath(fromLocation))

    if (fromIndex === -1)
      fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }


  //
  // ------------------------------------------------------------------ init
  //
  // Ensure the hash is encoded properly before doing anything else.
  // unencode
  const path = getHashPath()
  // encode
  const encodedPath = encodePath(path)
  if (path !== encodedPath)
    replaceHashPath(encodedPath)

  /**
   * 初始的location
   */
  const initialLocation = getDOMLocation()

  /** 
   * history stack
   */
  let allPaths = [ createPath(initialLocation) ]



  //
  // ------------------------------------------------------------------ implementation Public interface
  //

  /**
   * 创建location对应的超链接
   * 
   * @example
   * basename = '/flight'
   * 
   * // -> #/flight/#tag
   * createHref({ hash:'#hash' })
   * 
   * @param {Object} location location
   * @returns {String}
   */
  const createHref = (location) =>
    '#' + encodePath(basename + createPath(location))

  /**
   * push location
   * @param {String} path 新的路径
   * @param {Object} [state] 状态
   */
  const push = (path, state) => {
    // warning state被忽略
    warning(
      state === undefined,
      'Hash history cannot push state; it is ignored'
    )

    // 1. 新的action
    const action = 'PUSH'

    // 2. 新的location
    const location = createLocation(path, undefined, undefined, history.location)

    // 3. 提交location变换
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      // 创建path
      const path = createPath(location)

      // 编码后的path
      const encodedPath = encodePath(basename + path)

      // 检查hash是否变化
      const hashChanged = getHashPath() !== encodedPath

      // 发生变化
      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        // 将path标记未忽略的path, 从而避免hashchange中多次处理相同的path
        ignorePath = path

        // 新增访问记录
        pushHashPath(encodedPath)

        const prevIndex = allPaths.lastIndexOf(createPath(history.location))
        const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)

        nextPaths.push(path)
        allPaths = nextPaths

        // 保存最新的状态
        setState({ action, location })
      } else {
        warning(
          false,
          'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
        )

        setState()
      }
    })
  }

  /**
   * replace location
   * @param {String} path 新的路径
   * @param {Object} [state] 状态
   */
  const replace = (path, state) => {
    warning(
      state === undefined,
      'Hash history cannot replace state; it is ignored'
    )

    // 1. 新的action
    const action = 'REPLACE'

    // 2. 新的location
    const location = createLocation(path, undefined, undefined, history.location)

    // 3. 提交location变换
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      // 创建path
      const path = createPath(location)

      // 编码后的path
      const encodedPath = encodePath(basename + path)

      // 是否发生变化
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path

        // 替换path
        replaceHashPath(encodedPath)
      }

      const prevIndex = allPaths.indexOf(createPath(history.location))

      if (prevIndex !== -1)
        allPaths[prevIndex] = path

      setState({ action, location })
    })
  }

  /**
   * go(n)
   * @param {Number} n index
   */
  const go = (n) => {
    warning(
      canGoWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    )

    globalHistory.go(n)
  }

  /**
   * 回退
   */
  const goBack = () =>
    go(-1)

  /**
   * 前进
   */
  const goForward = () =>
    go(1)

  let listenerCount = 0

  /**
   * 检查DOM hashchange 确保同一时刻只有一个listener  ( 方便处理,节约内存 )
   * delta > 1: 无需订阅多次
   * delta = 1: 出现首个消费者, 订阅一次
   * delta = 0: 没有消费者, 取消订阅
   * 
   * @param {Number} delta 消费者 - 为了确保同一时刻只有一个 hashchange listener
   */
  const checkDOMListeners = (delta) => {
    listenerCount += delta

    if (listenerCount === 1) {
      addEventListener(window, HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
      removeEventListener(window, HashChangeEvent, handleHashChange)
    }
  }

  /**
   * 是否正在中断
   */
  let isBlocked = false

  /**
   * 中断变换,等待用户确认
   * @param {Boolean|String|Function} prompt 
   * @returns {Function} 返回取消函数
   */
  const block = (prompt = false) => {
    const unblock = transitionManager.setPrompt(prompt)

    // 没有在中断, 添加监听函数, 确保无法通过改变URL来改变hash
    if (!isBlocked) {
      checkDOMListeners(1)
      isBlocked = true
    }

    return () => {
      // 取消监听
      if (isBlocked) {
        isBlocked = false
        checkDOMListeners(-1)
      }

      // 解锁
      return unblock()
    }
  }
  
  /**
   * 订阅location change
   * @param {Function} listener
   */
  const listen = (listener) => {
    // 追加订阅者
    const unlisten = transitionManager.appendListener(listener)

    // 确保hashchange 被监听
    checkDOMListeners(1)

    return () => {
      // 确保hashchange 在没有listener的情况下, 取消监听
      checkDOMListeners(-1)

      // 取消订阅
      unlisten()
    }
  }

  const history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen
  }

  return history
}

export default createHashHistory
