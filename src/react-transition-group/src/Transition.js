import * as PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { polyfill } from 'react-lifecycles-compat'

import { timeoutsShape } from './utils/PropTypes'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the components.
 * It's up to you to give meaning and effect to those states. For example we can
 * add styles to a component when it enters or exits:
 *
 * ```jsx
 * import Transition from 'react-transition-group/Transition';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 0 },
 *   entered:  { opacity: 1 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {(state) => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * As noted the `Transition` component doesn't _do_ anything by itself to its child component.
 * What it does do is track transition states over time so you can update the
 * component (such as by adding styles or classes) when it changes states.
 *
 * There are 4 main states a Transition can be in:
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component begins the
 * "Enter" stage. During this stage, the component will shift from its current transition state,
 * to `'entering'` for the duration of the transition and then to the `'entered'` stage once
 * it's complete. Let's take the following example:
 *
 * ```jsx
 * state = { in: false };
 *
 * toggleEnterState = () => {
 *   this.setState({ in: true });
 * }
 *
 * render() {
 *   return (
 *     <div>
 *       <Transition in={this.state.in} timeout={500} />
 *       <button onClick={this.toggleEnterState}>Click to Enter</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state and
 * stay there for 500ms (the value of `timeout`) before it finally switches to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from `'exiting'` to `'exited'`.
 *
 * ## Timing
 *
 * Timing is often the trickiest part of animation, mistakes can result in slight delays
 * that are hard to pin down. A common example is when you want to add an exit transition,
 * you should set the desired final styles when the state is `'exiting'`. That's when the
 * transition to those styles will start and, if you matched the `timeout` prop with the
 * CSS Transition duration, it will end exactly when the state changes to `'exited'`.
 *
 * > **Note**: For simpler transitions the `Transition` component might be enough, but
 * > take into account that it's platform-agnostic, while the `CSSTransition` component
 * > [forces reflows](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * > in order to make more complex transitions more predictable. For example, even though
 * > classes `example-enter` and `example-enter-active` are applied immediately one after
 * > another, you can still transition from one to the other because of the forced reflow
 * > (read [this issue](https://github.com/reactjs/react-transition-group/issues/159#issuecomment-322761171)
 * > for more info). Take this into account when choosing between `Transition` and
 * > `CSSTransition`.
 *
 * ## Example
 *
 * <iframe src="https://codesandbox.io/embed/741op4mmj0?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
 *
 */
class Transition extends React.Component {
  static contextTypes = {
    transitionGroup: PropTypes.object,
  }

  static childContextTypes = {
    transitionGroup: () => {},
  }

  constructor(props, context) {
    super(props, context)

    let parentGroup = context.transitionGroup
    // In the context of a TransitionGroup all enters are really appears
    let appear =
      parentGroup && !parentGroup.isMounting ? props.enter : props.appear

    let initialStatus

    /**
     * 
     */
    this.appearStatus = null

    //
    // 初始化状态
    //
    if (props.in) {
      // 进场: 
      if (appear) {
        initialStatus = EXITED
        this.appearStatus = ENTERING
      } else {
        initialStatus = ENTERED
      }
    } else {
      // 离场: 

      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED
      } else {
        initialStatus = EXITED
      }
    }

    this.state = { status: initialStatus }

    /**
     * 
     */
    this.nextCallback = null
  }

  getChildContext() {
    return { transitionGroup: null } // allows for nested Transitions
  }

  /**
   * 基于props更新状态
   * @param {Object} nextProps 新接收到的props 
   * @param {Object} prevState 旧的state
   * @returns {Object} 返回新的state
   */
  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    // in = true UNMOUNTED -> EXITED
    if (nextIn && prevState.status === UNMOUNTED) {
      return { status: EXITED }
    }

    return null
  }

  // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null

  //   if (prevProps !== this.props) {
  //     const { status } = this.state

  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }

  //   return { nextStatus }
  // }

  componentDidMount() {
    this.updateStatus(true, this.appearStatus)
  }

  componentDidUpdate(prevProps) {
    let nextStatus = null

    //
    // props 变换 - 改变状态
    //
    if (prevProps !== this.props) {
      const { status } = this.state

      if (this.props.in) {
        // 如果还没有"进场" , 那么重新进场
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        // 如果"正在进场"或"已经进场", 那么开始退场
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
    }

    this.updateStatus(false, nextStatus)
  }

  componentWillUnmount() {
    this.cancelNextCallback()
  }

  /**
   * 
   */
  getTimeouts() {
    const { timeout } = this.props
    let exit, enter, appear

    exit = enter = appear = timeout

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit
      enter = timeout.enter
      appear = timeout.appear
    }
    return { exit, enter, appear }
  }

  /**
   * 更新状态
   * @param {boolean} mounting 
   * @param {string} nextStatus 下一个状态
   */
  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback()

      // 找到children DOM
      const node = ReactDOM.findDOMNode(this)

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting)
      } else {
        this.performExit(node)
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      // 在 "exited"的情况下, 销毁子组件
      this.setState({ status: UNMOUNTED })
    }
  }

  /**
   * 执行 "enter" 
   * @param {HTMLElement} node 渲染元素
   * @param {Boolean} mounting 是否正在mount
   */
  performEnter(node, mounting) {
    const { enter } = this.props

    // 1. 渲染元素是否正在mount
    const appearing = this.context.transitionGroup
      ? this.context.transitionGroup.isMounting
      : mounting

    // 2. 获得过渡时长
    const timeouts = this.getTimeouts()

    // 3. 不满足触发过渡的条件, 跳过动画, 将状态直接设置为"entered"
    // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set
    if (!mounting && !enter) {
      this.safeSetState({ status: ENTERED }, () => {
        this.props.onEntered(node)
      })
      return
    }

    // 4. emit onEnter
    this.props.onEnter(node, appearing)

    this.safeSetState({ status: ENTERING }, () => {
      this.props.onEntering(node, appearing)

      // FIXME: appear timeout?
      this.onTransitionEnd(node, timeouts.enter, () => {
        this.safeSetState({ status: ENTERED }, () => {
          this.props.onEntered(node, appearing)
        })
      })
    })
  }

  /**
   * 执行 "exit"
   * @param {Boolean} mounting 是否正在mount
   */
  performExit(node) {
    const { exit } = this.props
    const timeouts = this.getTimeouts()

    // 跳过动画
    // no exit animation skip right to EXITED
    if (!exit) {
      this.safeSetState({ status: EXITED }, () => {
        this.props.onExited(node)
      })
      return
    }

    this.props.onExit(node)

    this.safeSetState({ status: EXITING }, () => {
      this.props.onExiting(node)

      this.onTransitionEnd(node, timeouts.exit, () => {
        this.safeSetState({ status: EXITED }, () => {
          this.props.onExited(node)
        })
      })
    })
  }

  /**
   * 取消回调函数
   */
  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel()
      this.nextCallback = null
    }
  }

  /** 
   * 用安全的方式 更新组件状态
   * @param {String} nextState 新的状态
   * @param {Function} callback 回调函数
   */ 
  safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback)
    this.setState(nextState, callback)
  }

  /**
   * 设置回调函数, 返回一个允许取消的callback
   * @param {Function} callback 
   */
  setNextCallback(callback) {
    let active = true

    this.nextCallback = event => {
      if (active) {
        active = false
        this.nextCallback = null

        callback(event)
      }
    }

    this.nextCallback.cancel = () => {
      active = false
    }

    return this.nextCallback
  }

  /**
   * 监听transition-end
   */
  onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler)

    if (node) {
      if (this.props.addEndListener) {
        this.props.addEndListener(node, this.nextCallback)
      }
      if (timeout != null) {
        setTimeout(this.nextCallback, timeout)
      }
    } else {
      setTimeout(this.nextCallback, 0)
    }
  }

  render() {
    const status = this.state.status

    // status = UNMOUNTED 不渲染子组件
    if (status === UNMOUNTED) {
      return null
    }

    const { children, ...childProps } = this.props
    // filter props for Transtition
    delete childProps.in
    delete childProps.mountOnEnter
    delete childProps.unmountOnExit
    delete childProps.appear
    delete childProps.enter
    delete childProps.exit
    delete childProps.timeout
    delete childProps.addEndListener
    delete childProps.onEnter
    delete childProps.onEntering
    delete childProps.onEntered
    delete childProps.onExit
    delete childProps.onExiting
    delete childProps.onExited

    if (typeof children === 'function') {
      return children(status, childProps)
    }

    const child = React.Children.only(children)
    return React.cloneElement(child, childProps)
  }
}

Transition.propTypes = {
  /**
   * A `function` child can be used instead of a React element.
   * This function is called with the current transition status
   * ('entering', 'entered', 'exiting', 'exited', 'unmounted'), which can be used
   * to apply context specific props to a component.
   *
   * ```jsx
   * <Transition timeout={150}>
   *   {(status) => (
   *     <MyComponent className={`fade fade-${status}`} />
   *   )}
   * </Transition>
   * ```
   */
  children: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,

  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,

  /**
   * By default the child component is mounted immediately along with
   * the parent `Transition` component. If you want to "lazy mount" the component on the
   * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
   * mounted, even on "exited", unless you also specify `unmountOnExit`.
   */
  mountOnEnter: PropTypes.bool,

  /**
   * By default the child component stays mounted after it reaches the `'exited'` state.
   * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
   * If you want to transition on the first mount set `appear` to `true`, and the
   * component will transition in as soon as the `<Transition>` mounts.
   *
   * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
   */
  appear: PropTypes.bool,

  /**
   * Enable or disable enter transitions.
   */
  enter: PropTypes.bool,

  /**
   * Enable or disable exit transitions.
   */
  exit: PropTypes.bool,

  /**
   * The duration of the transition, in milliseconds.
   * Required unless `addEndListener` is provided
   *
   * You may specify a single timeout for all transitions like: `timeout={500}`,
   * or individually like:
   *
   * ```jsx
   * timeout={{
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * @type {number | { enter?: number, exit?: number }}
   */
  timeout: (props, ...args) => {
    let pt = timeoutsShape
    if (!props.addEndListener) pt = pt.isRequired
    return pt(props, ...args)
  },

  /**
   * Add a custom transition end trigger. Called with the transitioning
   * DOM node and a `done` callback. Allows for more fine grained transition end
   * logic. **Note:** Timeouts are still used as a fallback if provided.
   *
   * ```jsx
   * addEndListener={(node, done) => {
   *   // use the css transitionend event to mark the finish of a transition
   *   node.addEventListener('transitionend', done, false);
   * }}
   * ```
   */
  addEndListener: PropTypes.func,

  /**
   * Callback fired before the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired before the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the "exited" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExited: PropTypes.func,
}

// Name the function so it is clearer in the documentation
function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop,
}

Transition.UNMOUNTED = 0
Transition.EXITED = 1
Transition.ENTERING = 2
Transition.ENTERED = 3
Transition.EXITING = 4

export default polyfill(Transition)
