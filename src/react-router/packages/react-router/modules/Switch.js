import React from "react";
import PropTypes from "prop-types";
import warning from "warning";
import invariant from "invariant";
import matchPath from "./matchPath";

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  };

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };
 
  componentWillMount() {
    // <Switch> 必须被Router包裹
    invariant(
      this.context.router,
      "You should not use <Switch> outside a <Router>"
    );
  }

  componentWillReceiveProps(nextProps) {
    warning(
      !(nextProps.location && !this.props.location),
      '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    );

    warning(
      !(!nextProps.location && this.props.location),
      '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    );
  }

  render() {
    const { route } = this.context.router;
    const { children } = this.props;

    // 1. 优先使用router.route.location
    const location = this.props.location || route.location;

    let match, child;
    
    // 2. 遍历子元素, 找出首次匹配location的元素, 将它渲染出来
    React.Children.forEach(children, element => {
      if (match == null && React.isValidElement(element)) {
        const {
          path: pathProp,
          exact,
          strict,
          sensitive,
          from
        } = element.props;
        const path = pathProp || from;

        child = element;

        // 匹配路径, 如果没有匹配到 返回 route.match
        match = matchPath(
          location.pathname,
          { path, exact, strict, sensitive },
          route.match
        );
      }
    });

    // 3. 渲染子元素 - 附加 locaiton, match属性
    return match
      ? React.cloneElement(child, { location, computedMatch: match })
      : null;
  }
}

export default Switch;
