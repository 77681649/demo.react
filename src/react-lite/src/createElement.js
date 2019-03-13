import * as _ from "./util";
import { VELEMENT, VSTATELESS, VCOMPONENT, VCOMMENT } from "./constant";
import { createVnode } from "./virtual-dom";

/**
 *
 *
 * @export
 * @param {any} type
 * @param {any} props
 * @param {any} children
 * @returns
 */
export default function createElement(type, props, children) {
  //
  // 识别: 类型
  //
  let vtype = null;
  if (typeof type === "string") {
    vtype = VELEMENT;
  } else if (typeof type === "function") {
    if (type.prototype && type.prototype.isReactComponent) {
      vtype = VCOMPONENT;
    } else {
      vtype = VSTATELESS;
    }
  } else {
    throw new Error(`React.createElement: unexpect type [ ${type} ]`);
  }

  //
  // 处理 props
  //
  let key = null;
  let ref = null;
  let finalProps = {};
  if (props != null) {
    for (let propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === "key") {
        if (props.key !== undefined) {
          key = "" + props.key;
        }
      } else if (propKey === "ref") {
        if (props.ref !== undefined) {
          ref = props.ref;
        }
      } else {
        finalProps[propKey] = props[propKey];
      }
    }
  }

  //
  // 处理 defaultProps
  //
  let defaultProps = type.defaultProps;
  if (defaultProps) {
    for (let propKey in defaultProps) {
      if (finalProps[propKey] === undefined) {
        finalProps[propKey] = defaultProps[propKey];
      }
    }
  }

  //
  // 处理 children
  //
  let argsLen = arguments.length;
  let finalChildren = children;

  if (argsLen > 3) {
    finalChildren = Array(argsLen - 2);
    for (let i = 2; i < argsLen; i++) {
      finalChildren[i - 2] = arguments[i];
    }
  }

  if (finalChildren !== undefined) {
    finalProps.children = finalChildren;
  }

  //
  // 创建元素对应的虚拟节点
  //
  return createVnode(vtype, type, finalProps, key, ref);
}

export function isValidElement(obj) {
  return obj != null && !!obj.vtype;
}

export function cloneElement(originElem, props, ...children) {
  let { type, key, ref } = originElem;
  let newProps = _.extend(_.extend({ key, ref }, originElem.props), props);
  let vnode = createElement(type, newProps, ...children);
  if (vnode.ref === originElem.ref) {
    vnode.refs = originElem.refs;
  }
  return vnode;
}

export function createFactory(type) {
  let factory = (...args) => createElement(type, ...args);
  factory.type = type;
  return factory;
}
