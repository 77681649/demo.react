import PropTypes from 'prop-types'
import React from 'react'
import { polyfill } from 'react-lifecycles-compat'


import {
  getChildMapping,
  getInitialChildMapping,
  getNextChildMapping,
} from './utils/ChildMapping'

const values = Object.values || (obj => Object.keys(obj).map(k => obj[k]))

const propTypes = {
  /**
   * `<TransitionGroup>` renders a `<div>` by default. You can change this
   * behavior by providing a `component` prop.
   * If you use React v16+ and would like to avoid a wrapping `<div>` element
   * you can pass in `component={null}`. This is useful if the wrapping div
   * borks your css styles.
   */
  component: PropTypes.any,
  /**
   * A set of `<Transition>` components, that are toggled `in` and out as they
   * leave. the `<TransitionGroup>` will inject specific transition props, so
   * remember to spread them through if you are wrapping the `<Transition>` as
   * with our `<Fade>` example.
   */
  children: PropTypes.node,

  /**
   * A convenience prop that enables or disables appear animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  appear: PropTypes.bool,
  /**
   * A convenience prop that enables or disables enter animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  enter: PropTypes.bool,
  /**
   * A convenience prop that enables or disables exit animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  exit: PropTypes.bool,

  /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */
  childFactory: PropTypes.func,
}

const defaultProps = {
  component: 'div',
  childFactory: child => child,
}

/**
 * The `<TransitionGroup>` component manages a set of `<Transition>` components
 * in a list. Like with the `<Transition>` component, `<TransitionGroup>`, is a
 * state machine for managing the mounting and unmounting of components over
 * time.
 *
 * Consider the example below using the `Fade` CSS transition from before.
 * As items are removed or added to the TodoList the `in` prop is toggled
 * automatically by the `<TransitionGroup>`. You can use _any_ `<Transition>`
 * component in a `<TransitionGroup>`, not just css.
 *
 * ## Example
 *
 * <iframe src="https://codesandbox.io/embed/00rqyo26kn?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
 *
 * Note that `<TransitionGroup>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual `<Transition>`
 * components. This means you can mix and match animations across different
 * list items.
 */
class TransitionGroup extends React.Component {
  static childContextTypes = {
    transitionGroup: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    const handleExited = this.handleExited.bind(this)

    // Initial children should all be entering, dependent on appear
    this.state = {
      handleExited,
      firstRender: true,
    }
  }

  getChildContext() {
    return {
      /**
       * transitionGroup的状态
       * isMounting - 标记是不是所有的子组件都已经mount, true - yes; false - no
       */
      transitionGroup: { isMounting: !this.appeared },
    }
  }

  componentDidMount() {
    // 标记未 appeared 结束
    this.appeared = true
  }

  /**
   * 基于props更新状态
   * @param {Object} nextProps 新接收到的props 
   * @param {Object} prevState 旧的state
   * @returns {Object} 返回新的state
   */
  static getDerivedStateFromProps(
    nextProps,
    { children: prevChildMapping, handleExited, firstRender }
  ) {
    return {
      children: firstRender
        // 初始化所有子组件
        ? getInitialChildMapping(nextProps, handleExited)

        // 更新children
        : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false,
    }
  }

  /**
   * 当"exited"时触发
   * @param {ReactElement} child 子元素的组件实例
   * @param {HTMLElement} node 子元素
   */
  handleExited(child, node) {
    let currentChildMapping = getChildMapping(this.props.children)

    // 如果 被exited的子组件在children中
    // 那么 结束处理
    if (child.key in currentChildMapping) return

    // emit onExited
    if (child.props.onExited) {
      child.props.onExited(node)
    }

    // 更新状态
    this.setState(state => {
      let children = { ...state.children }

      // 从children删除"exited"的children
      delete children[child.key]

      // 更新children
      return { children }
    })
  }

  render() {
    const { component: Component, childFactory, ...props } = this.props

    // state.childrend: Map<key,React>
    const children = values(this.state.children).map(childFactory)

    delete props.appear
    delete props.enter
    delete props.exit

    if (Component === null) {
      return children
    }

    return <Component {...props}>{children}</Component>
  }
}

TransitionGroup.propTypes = propTypes
TransitionGroup.defaultProps = defaultProps

export default polyfill(TransitionGroup)
