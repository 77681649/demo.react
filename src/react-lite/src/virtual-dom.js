import * as _ from "./util";
import {
  SVGNamespaceURI,
  VELEMENT,
  VSTATELESS,
  VCOMPONENT,
  VCOMMENT,
  HTML_KEY
} from "./constant";

/**
 * VNode
 * @typedef {Object}
 * @property {String} [uid] 节点的唯一标识
 * @property {Number} vtype 1 = 文本 , 2 = 元素 , 3 = 无状态组件 , 4 = 有状态的组件 , 5 = 注释
 * @property {String | Component | Function} type [ 2 = 元素名称(标签名称) , 3 = 组件的构造器 , 4 = 组件构造函数]
 * @property {String} key 节点的键
 * @property {Object} props 节点的属性
 * @property {Object} refs
 * @property {String | Function} ref
 */

/**
 * DOM 节点的附加属性
 * vchildren {VNode[]} 存储该节点的子节点
 * cache {Map<uid , Object>} 无状态组件 , 保存无状态组件渲染出来的虚拟接节点树 ;
 * eventStore {}
 */

/**
 * NodeCache
 * @typedef {Object}
 */

/**
 * current stateful component's refs property
 * will attach to every vnode created by calling component.render method
 */
let refs = null;

/**
 * 根据虚拟节点 , 创建对应的DOM Tree , 并返回创建的DOM Tree
 * @export
 * @param {VNode} vnode
 * @param {Object} parentContext
 * @param {String} namespaceURI
 * @returns {HtmlElement}
 */
function initVnode(vnode, parentContext, namespaceURI) {
  let { vtype } = vnode;
  let creator = null;

  if (isTextElement(vtype)) creator = initText;
  else if (isVElement(vtype)) creator = initVelem;
  else if (isStateComponent(vtype)) creator = initVcomponent;
  else if (isStatelessComponent(vtype)) creator = initVstateless;
  else if (isCommentElement(vtype)) creator = initComment;

  return creator
    ? creator.call(null, vnode, parentContext, namespaceURI)
    : null;
}

/**
 * 更新 VDOM对应的DOM (根据不同类型执行不同更新操作)
 * @param {VNode} vnode 旧的虚拟根结点
 * @param {VNode} newVnode 新的虚拟根结点
 * @param {Node} node 旧的根结点
 * @param {Object} parentContext 父级上下文
 */
function updateVnode(vnode, newVnode, node, parentContext) {
  let { vtype } = vnode;

  if (vtype === VCOMPONENT) {
    return updateVcomponent(vnode, newVnode, node, parentContext);
  }

  if (vtype === VSTATELESS) {
    return updateVstateless(vnode, newVnode, node, parentContext);
  }

  // ignore VCOMMENT and other vtypes
  if (vtype !== VELEMENT) {
    return node;
  }

  // 是否是特殊字符
  let oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html;

  if (oldHtml != null) {
    // 内嵌HTML需要重新构造整个DOM Tree
    updateVelem(vnode, newVnode, node, parentContext);
    initVchildren(newVnode, node, parentContext);
  } else {
    updateVChildren(vnode, newVnode, node, parentContext);
    updateVelem(vnode, newVnode, node, parentContext);
  }
  return node;
}

/**
 * 更新子树:
 * @param {VNode} vnode 旧的虚拟根结点
 * @param {VNode} newVnode 新的虚拟根结点
 * @param {Node} node 旧的根结点
 * @param {Object} parentContext 父级上下文
 */
function updateVChildren(vnode, newVnode, node, parentContext) {
  let patches = {
    removes: [],
    updates: [],
    creates: []
  };

  //
  // 找出差异
  //
  diffVchildren(patches, vnode, newVnode, node, parentContext);

  //
  // 应用 patch
  //
  _.flatEach(patches.removes, applyDestroy);
  _.flatEach(patches.updates, applyUpdate);
  _.flatEach(patches.creates, applyCreate);
}

/**
 *
 * @param {Object} patches 补丁
 * @param {VNode} vnode    旧的VDOM
 * @param {VNode} newVnode 新的VDOM
 * @param {Node} node 旧的根结点
 * @param {Object} parentContext 父级上下文
 */
function diffVchildren(patches, vnode, newVnode, node, parentContext) {
  //
  // 子结点集合
  //
  let { childNodes, vchildren } = node;
  let newVchildren = (node.vchildren = getFlattenChildren(newVnode));

  //
  // 长度
  //
  let vchildrenLen = vchildren.length;
  let newVchildrenLen = newVchildren.length;

  if (vchildrenLen === 0 && newVchildrenLen > 0) {
    //
    // 新增
    //
    for (let i = 0; i < newVchildrenLen; i++) {
      _.addItem(patches.creates, {
        vnode: newVchildren[i],
        parentNode: node,
        parentContext: parentContext,
        index: i
      });
    }

    return;
  } else if (newVchildrenLen === 0) {
    //
    // 删除
    //
    for (let i = 0; i < vchildrenLen; i++) {
      _.addItem(patches.removes, {
        vnode: vchildren[i],
        node: childNodes[i]
      });
    }
    return;
  }

  let updates = Array(newVchildrenLen); // 需要更新的
  let removes = null; // 需要删除的
  let creates = null; // 需要新增的

  // isEqual
  for (let i = 0; i < vchildrenLen; i++) {
    let vnode = vchildren[i];
    for (let j = 0; j < newVchildrenLen; j++) {
      // 跳过已经处理了的
      if (updates[j]) {
        continue;
      }

      let newVnode = newVchildren[j];

      //
      // 忽略完全相等的
      //
      if (vnode === newVnode) {
        let shouldIgnore = true;
        if (parentContext) {
          if (vnode.vtype === VCOMPONENT || vnode.vtype === VSTATELESS) {
            if (vnode.type.contextTypes) {
              shouldIgnore = false;
            }
          }
        }

        updates[j] = {
          shouldIgnore: shouldIgnore,
          vnode: vnode,
          newVnode: newVnode,
          node: childNodes[i],
          parentContext: parentContext,
          index: j
        };
        vchildren[i] = null;
        break;
      }
    }
  }

  // isSimilar
  for (let i = 0; i < vchildrenLen; i++) {
    let vnode = vchildren[i];
    if (vnode === null) {
      continue;
    }
    let shouldRemove = true;
    for (let j = 0; j < newVchildrenLen; j++) {
      if (updates[j]) {
        continue;
      }
      let newVnode = newVchildren[j];
      if (
        newVnode.type === vnode.type &&
        newVnode.key === vnode.key &&
        newVnode.refs === vnode.refs
      ) {
        updates[j] = {
          vnode: vnode,
          newVnode: newVnode,
          node: childNodes[i],
          parentContext: parentContext,
          index: j
        };
        shouldRemove = false;
        break;
      }
    }
    if (shouldRemove) {
      if (!removes) {
        removes = [];
      }
      _.addItem(removes, {
        vnode: vnode,
        node: childNodes[i]
      });
    }
  }

  for (let i = 0; i < newVchildrenLen; i++) {
    let item = updates[i];
    if (!item) {
      if (!creates) {
        creates = [];
      }
      _.addItem(creates, {
        vnode: newVchildren[i],
        parentNode: node,
        parentContext: parentContext,
        index: i
      });
    } else if (item.vnode.vtype === VELEMENT) {
      diffVchildren(
        patches,
        item.vnode,
        item.newVnode,
        item.node,
        item.parentContext
      );
    }
  }

  if (removes) {
    _.addItem(patches.removes, removes);
  }
  if (creates) {
    _.addItem(patches.creates, creates);
  }
  _.addItem(patches.updates, updates);
}

function applyUpdate(data) {
  if (!data) {
    return;
  }
  let vnode = data.vnode;
  let newNode = data.node;

  // update
  if (!data.shouldIgnore) {
    if (!vnode.vtype) {
      newNode.replaceData(0, newNode.length, data.newVnode);
    } else if (vnode.vtype === VELEMENT) {
      updateVelem(vnode, data.newVnode, newNode, data.parentContext);
    } else if (vnode.vtype === VSTATELESS) {
      newNode = updateVstateless(
        vnode,
        data.newVnode,
        newNode,
        data.parentContext
      );
    } else if (vnode.vtype === VCOMPONENT) {
      newNode = updateVcomponent(
        vnode,
        data.newVnode,
        newNode,
        data.parentContext
      );
    }
  }

  // re-order
  let currentNode = newNode.parentNode.childNodes[data.index];
  if (currentNode !== newNode) {
    newNode.parentNode.insertBefore(newNode, currentNode);
  }
  return newNode;
}

function applyDestroy(data) {
  destroyVnode(data.vnode, data.node);
  data.node.parentNode.removeChild(data.node);
}

function applyCreate(data) {
  let node = initVnode(
    data.vnode,
    data.parentContext,
    data.parentNode.namespaceURI
  );

  data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
}

/**
 * 销毁虚拟节点 ( 以及其下的所有子节点 )
 * Only vnode which has props.children need to call destroy function
 * to check whether subTree has component that need to call lify-cycle method and release cache.
 * @param {VNode} vnode 虚拟节点
 * @param {Element} node 虚拟节点对应的DOM节点
 */
let destroyVnode = (vnode, node) => {
  let { vtype } = vnode;
  let destroyer;

  if (isVElement(vtype)) destroyer = destroyVelem;
  else if (isStateComponent(vtype)) destroyer = destroyVcomponent;
  else if (isStatelessComponent(vtype)) destroyer = destroyVstateless;

  if (destroyer) {
    destroyer(vnode, node);
  }
};

//
// ------------------------------------------------ TEXT
//
function initText(vnode) {
  return document.createTextNode(vnode);
}

//
// ------------------------------------------------ VELEMENT
//

/**
 * 根据虚拟元素 , 创建对应的DOM Tree
 *
 * @param {any} velem
 * @param {any} parentContext
 * @param {any} namespaceURI
 * @returns {HtmlElement} 返回DOM Tree
 */
function initVelem(velem, parentContext, namespaceURI) {
  let { type, props } = velem;

  //
  // 创建元素
  //
  let createElement = (vnode, namespaceURI) => {
    let { type } = vnode;

    return type === "svg" || namespaceURI === SVGNamespaceURI
      ? document.createElementNS(SVGNamespaceURI, type)
      : document.createElement(type);
  };

  let setPropsForRootNode = () => {
    let isCustomComponent = type.indexOf("-") >= 0 || props.is != null;

    _.setProps(rootNode, props, isCustomComponent);
  };

  // 1. 创建跟节点
  let rootNode = createElement(velem);

  // 遍历构造所有子节点
  initVchildren(velem, rootNode, parentContext);

  // 设置根节点的数据
  setPropsForRootNode();

  // 记录虚拟节点和节点之间的关系
  if (velem.ref != null) {
    enqueuePendingsRefs(velem, rootNode);
  }

  return rootNode;
}

/**
 * 遍历创建虚拟节点的子树
 *
 * @param {any} velem
 * @param {any} node
 * @param {any} parentContext
 */
function initVchildren(velem, node, parentContext) {
  let vchildren = (node.vchildren = getFlattenChildren(velem)); // 所有子结点
  let namespaceURI = node.namespaceURI; // 命名空间

  renderVchildren(node, vchildren, parentContext, namespaceURI);
}

/**
 * 获得vnode的所有子节点 , 返回
 *
 * @param {VNode} vnode 虚拟节点
 * @returns {VNode[]}
 */
function getFlattenChildren(vnode) {
  let { children } = vnode.props; // 结点的子结点集合
  let vchildren = []; // 所有子节点

  // 后序遍历: 获得子结点的列表
  treePostOrder(children, collectChild, vchildren);

  return vchildren;
}

/**
 *
 * @param {VNode} child
 * @param {VNode[]} children
 */
function collectChild(child, children) {
  if (isInvalidChildNode(child)) {
    return;
  }

  let { vtype } = child;

  if (isTextElement(vtype)) {
    if (isImutableJSData(child)) {
      handleChildImmutableData(child, children);

      return;
    } else {
      child = handleChildText(child);
    }
  }

  children[children.length] = child;
}

/**
 * 后序遍历
 * 遍历顺序: 右 ~ 左
 *
 * @param {VNode} rootNode 根结点
 * @param {Function} iterate 迭代器
 * @Param {VNode []} nodes 遍历到的结点
 */
function treePostOrder(rootNode, iterate, nodes) {
  // flatEach的循环: length -> 0 (从右往左)

  _.isArr(rootNode)
    ? _.flatEach(rootNode, iterate, nodes) // 非叶子结点,继续遍历
    : iterate(rootNode, nodes); // 叶子结点
}

function isInvalidChildNode(child) {
  return child == null || typeof child === "boolean";
}

function handleChildText(child) {
  return "" + child;
}

function handleChildImmutableData(data, children) {
  data = data.toJS();

  treePostOrder(data, collectChild, children);
}

/**
 * 渲染
 *
 * @param {any} rootNode
 * @param {any} vnodes
 * @param {any} parentContext
 * @param {any} namespaceURI
 */
function renderVchildren(rootNode, vnodes, parentContext, namespaceURI) {
  let renderChildNode = vnode => initVnode(vnode, parentContext, namespaceURI);

  vnodes.forEach(vnode => {
    let childNode = renderChildNode(vnode);

    rootNode.appendChild(childNode);
  });
}

/**
 * 更新 VDOM对应的DOM
 * @param {VNode} vnode 旧的虚拟根结点
 * @param {VNode} newVnode 新的虚拟根结点
 * @param {Node} node 旧的根结点
 */
function updateVelem(velem, newVelem, node) {
  let isCustomComponent =
    velem.type.indexOf("-") >= 0 || velem.props.is != null;

  // patch 属性: 新增/更新/删除 (将新的内容 patch to 旧的结点, 从而新的结点)
  _.patchProps(node, velem.props, newVelem.props, isCustomComponent);

  //
  // 更新引用
  //
  if (velem.ref !== newVelem.ref) {
    detachRef(velem.refs, velem.ref, node);
    attachRef(newVelem.refs, newVelem.ref, node);
  }

  return node;
}

/**
 * 销毁虚拟元素节点
 * @param {VNode} velem 虚拟元素节点
 * @param {HtmlElement} node 节点
 */
let destroyVelem = (velem, node) => {
  let { props } = velem;
  let { vchildren, childNodes } = node;

  if (vchildren) {
    for (let i = 0, len = vchildren.length; i < len; i++) {
      destroyVnode(vchildren[i], childNodes[i]);
    }
  }

  detachRef(velem.refs, velem.ref, node);

  node.eventStore = node.vchildren = null;
};

//
// ------------------------------------------------ STATELESS COMPONENT
//

/**
 * 根据无状态组件 , 创建对应的DOM Tree
 *
 * @param {VNode} vstateless
 * @param {any} parentContext
 * @param {any} namespaceURI
 * @returns
 */
function initVstateless(vstateless, parentContext, namespaceURI) {
  let vnode = renderVstateless(vstateless, parentContext);
  let node = initVnode(vnode, parentContext, namespaceURI);

  addVNodeToNodeAttribute(node, vstateless.uid, vnode);

  return node;
}

/**
 * 更新 无状态组件对应的DOM
 * @param {VNode} vstateless 旧的组件对应的VDOM
 * @param {VNode} newVstateless 新的组件对应的VDOM
 * @param {Node} node 旧的根结点
 * @param {Object} parentContext 父级上下文
 * @returns {}
 */
function updateVstateless(vstateless, newVstateless, node, parentContext) {
  let uid = vstateless.uid;
  let vnode = node.cache[uid]; // 旧的VDOM Tree
  delete node.cache[uid];

  // 创建新的VDOM Tree
  let newVnode = renderVstateless(newVstateless, parentContext);

  let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
  newNode.cache = newNode.cache || {};
  newNode.cache[newVstateless.uid] = newVnode;
  if (newNode !== node) {
    syncCache(newNode.cache, node.cache, newNode);
  }

  return newNode;
}

function destroyVstateless(vstateless, node) {
  let uid = vstateless.uid;
  let vnode = node.cache[uid];
  delete node.cache[uid];
  destroyVnode(vnode, node);
}

/**
 * 渲染出无状态组件对应的虚拟节点树
 *
 * @param {VNode} vstateless 无状态组件
 * @param {Object} parentContext
 * @returns {VNode} 返回虚拟结点树的根结点
 */
function renderVstateless(vstateless, parentContext) {
  let { type: factory, props } = vstateless;
  let componentContext = getContextByTypes(parentContext, factory.contextTypes);
  let vnode = factory(props, componentContext);

  if (vnode && vnode.render) {
    vnode = vnode.render();
  }

  if (vnode === null || vnode === false) {
    vnode = createVnode(VCOMMENT);
  } else if (!vnode || !vnode.vtype) {
    throw new Error(
      `@${
        factory.name
      }#render:You may have returned undefined, an array or some other invalid object`
    );
  }

  return vnode;
}

//
// ------------------------------------------------ STATE COMPONENT
//

/**
 * 根据有状态的组件 , 创建对应的DOM Tree
 *
 * @param {VNode} vcomponent 虚拟组件
 * @param {Object} parentContext
 * @param {any} namespaceURI
 * @returns {HtmlElement}
 */
function initVcomponent(vcomponent, parentContext, namespaceURI) {
  let { type: Component, props, uid } = vcomponent;
  let component = createComponentInstance(Component, props, parentContext);
  let { $cache: cache } = component;
  let vnode, node;

  component.lockUpdater(); // 避免触发 Update
  component.tryEmitComponentWillMount(); // call componentWillMount

  vnode = renderComponent(component);

  node = initVnode(
    vnode,
    getChildContext(component, parentContext),
    namespaceURI
  );

  addVNodeToNodeAttribute(node, uid, component);

  component.updateNodeInfo(vnode, node);

  // mounted 阶段完成
  component.updateMountedState(true);

  // 将组件添加到待处理队列
  addPendingComponentQueue(component);

  // 记录虚拟节点和节点之间的关系
  if (vcomponent.ref != null) {
    enqueuePendingsRefs(vcomponent, component);
  }

  return node;
}

/**
 * 创建组件实例
 * @param {Function} Component 组件类
 * @param {Object} props 组件属性
 * @param {Object|null} parentContext 父级上下文对象
 */
function createComponentInstance(Component, props, parentContext) {
  // 获得组件的上下文
  let componentContext = getContextByTypes(
    parentContext,
    Component.contextTypes
  );

  // 创建组件实例
  let component = new Component(props, componentContext);

  component.$cache.parentContext = parentContext;

  // component.props = component.props || props
  // component.context = component.context || componentContext

  return component;
}

/**
 * 根据状态组件 , 渲染响应的虚拟节点
 *
 * @param {VNode} component
 * @param {Object} parentContext
 * @returns {VNode}
 */
let renderComponent = (component, parentContext) => {
  // 通过全局变量的方式 , 将组件的refs属性挂载到对应的VNode中
  refs = component.refs;

  let vnode = component.render();

  if (vnode === null || vnode === false) {
    vnode = createVnode(VCOMMENT);
  } else if (!vnode || !vnode.vtype) {
    throw new Error(
      `@${
        component.constructor.name
      }#render:You may have returned undefined, an array or some other invalid object`
    );
  }

  refs = null;

  return vnode;
};

/**
 * 获得传递给子组件的上下文
 *
 * @param {Object} component
 * @param {Object} parentContext
 * @returns {Object}
 */
let getChildContext = (component, parentContext) => {
  if (component.getChildContext) {
    let curContext = component.getChildContext();

    if (curContext) {
      parentContext = _.extend(_.extend({}, parentContext), curContext);
    }
  }

  return parentContext;
};

/**
 * 更新 状态组件对应的DOM
 * @param {VNode} vcomponent 旧的组件对应的VDOM
 * @param {VNode} newVcomponent 新的组件对应的VDOM
 * @param {Node} node 旧的根结点
 * @param {Object} parentContext 父级上下文
 */
function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
  let uid = vcomponent.uid;
  let component = node.cache[uid];
  let { $updater: updater, $cache: cache } = component;
  let { type: Component, props: nextProps } = newVcomponent;
  let componentContext = getContextByTypes(
    parentContext,
    Component.contextTypes
  );
  delete node.cache[uid];
  node.cache[newVcomponent.uid] = component;
  cache.parentContext = parentContext;

  //
  // 调用 componentWillReceiveProps
  //
  if (component.componentWillReceiveProps) {
    let needToggleIsPending = !updater.isPending;
    if (needToggleIsPending) updater.isPending = true;
    component.componentWillReceiveProps(nextProps, componentContext);
    if (needToggleIsPending) updater.isPending = false;
  }

  //
  // 处理引用
  //
  if (vcomponent.ref !== newVcomponent.ref) {
    detachRef(vcomponent.refs, vcomponent.ref, component);
    attachRef(newVcomponent.refs, newVcomponent.ref, component);
  }

  //
  // 更新组件
  //
  updater.tryUpdateComponent(nextProps, componentContext);

  return cache.node;
}

function destroyVcomponent(vcomponent, node) {
  let uid = vcomponent.uid;
  let component = node.cache[uid];
  let cache = component.$cache;
  delete node.cache[uid];
  detachRef(vcomponent.refs, vcomponent.ref, component);
  component.setState = component.forceUpdate = _.noop;
  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }
  destroyVnode(cache.vnode, node);
  delete component.setState;
  cache.isMounted = false;
  cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null;
}

/**
 * diffing
 * 比较old/new两颗VDOM Tree的差异 -> 生成patch -> 将patch应用到旧的DOM Tree
 * 形成新的DOM Tree 返回
 *
 * @param {VNode} vnode 旧的虚拟节点
 * @param {VNode} newVnode 新的虚拟节点
 * @param {HtmlElement} node 旧的DOM树的根节点
 * @param {Object} parentContext 传递给子节点的上下文 ( 包含父级,及其本级要传给子节点的上下文 )
 */
let compareTwoVnodes = (vnode, newVnode, node, parentContext) => {
  let newNode = node;

  let remove = () => {
    destroyVnode(vnode, node);

    node.parentNode.removeChild(node);
  };

  let replace = () => {
    destroyVnode(vnode, node);
    newNode = initVnode(newVnode, parentContext, node.namespaceURI);

    node.parentNode.replaceChild(newNode, node);
  };

  let update = () => {
    newNode = updateVnode(vnode, newVnode, node, parentContext);
  };

  /**
   * 1. 删除节点
   *
   *
   * 2. 替换节点
   *
   * 3. 更新节点
   */
  if (newVnode == null) {
    // remove
    remove();
  } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
    // replace
    replace();
  } else if (vnode !== newVnode || parentContext) {
    // same type and same key -> update
    update();
  }

  return newNode;
};

function getDOMNode() {
  return this;
}

function syncCache(cache, oldCache, node) {
  for (let key in oldCache) {
    if (!oldCache.hasOwnProperty(key)) {
      continue;
    }
    let value = oldCache[key];
    cache[key] = value;

    // is component, update component.$cache.node
    if (value.forceUpdate) {
      value.$cache.node = node;
    }
  }
}

/**
 * 添加缓存
 * @param {any} cache
 * @param {any} node
 * @param {any} key
 */
function addVNodeToNodeAttribute(node, key, cache) {
  node.cache = node.cache || {};
  node.cache[key] = cache;
}

/**
 * 消化掉等待的处理的任务
 */
function clearPending() {
  clearPendingRefs();
  clearPendingComponents();
}

//
// ------------------------------------------------ COMMENT
//
function initComment(vnode) {
  return document.createComment(`react-text: ${vnode.uid || _.getUid()}`);
}

//
// ------------------------------------------------ PENDING COMPONENT
//
/**
 * [
 *  componentInstance1,
 *  componentInstance2,
 *  ...
 * ]
 */
let pendingComponents = [];

let addPendingComponentQueue = component =>
  _.addItem(pendingComponents, component);

let clearPendingComponentQueue = () => (pendingComponents = []);

/**
 * 处理待更新的组件
 */
let clearPendingComponents = () => {
  let i = -1;
  let len = pendingComponents.length;
  let components = pendingComponents;

  // 无需处理
  if (len < 0) {
    return;
  }

  clearPendingComponentQueue();

  // 从子节点到父节点 , 依次更新
  while (len--) {
    let component = components[++i];
    let updater = component.$updater;

    if (component.componentDidMount) {
      component.componentDidMount();
    }

    //
    // 处理调用setState的导致的更新
    //
    updater.unlock();
    updater.tryUpdateComponent();
  }
};

//
// ------------------------------------------------ PENDING REFS
//
/**
 *
 * [
 *    vnode1, node1,
 *    vnode2, node2,
 *    ...
 * ]
 */
let pendingRefs = [];

/**
 *
 * 将虚拟节点和节点之间的关系添加到待处理等待 , 等到适当的时机再进行处理 ( mounted之后 , s)
 *
 * @param {VNode} vnode
 * @param {HtmlElement} node
 */
let enqueuePendingsRefs = (vnode, node) => {
  _.addItem(pendingRefs, vnode);
  _.addItem(pendingRefs, node);
};

let clearPendingRefsQueue = () => {
  pendingRefs = [];
};

/**
 * 消化掉待处理的refs
 */
let clearPendingRefs = () => {
  let list, vnode, refValue;
  let len = pendingRefs.length;

  // 无需处理
  if (len < 0) {
    return;
  }

  list = pendingRefs;

  for (let i = 0; i < len; i += 2) {
    vnode = list[i];
    refValue = list[i + 1];

    attachRef(vnode.refs, vnode.ref, refValue);
  }

  clearPendingRefsQueue();
};

/**
 *
 * @param {Object} refs
 * @param {Any} refKey
 * @param {Any} refValue
 */
let attachRef = (refs, refKey, refValue) => {
  if (refKey == null || !refValue) {
    return;
  }

  if (refValue.nodeName && !refValue.getDOMNode) {
    // support react v0.13 style: this.refs.myInput.getDOMNode()
    refValue.getDOMNode = getDOMNode;
  }

  if (_.isFn(refKey)) {
    refKey(refValue);
  } else if (refs) {
    refs[refKey] = refValue;
  }
};

/**
 *
 *
 * @param {any} refs
 * @param {any} refKey
 * @param {any} refValue
 */
let detachRef = (refs, refKey, refValue) => {
  if (refKey == null) {
    return;
  }

  if (_.isFn(refKey)) {
    refKey(null);
  } else if (refs && refs[refKey] === refValue) {
    delete refs[refKey];
  }
};

//
// ------------------------------------------------ COMMON FUNCTION
//
function isTextElement(vtype) {
  return !vtype;
}

function isVElement(vtype) {
  return vtype === VELEMENT;
}
function isStateComponent(vtype) {
  return vtype === VCOMPONENT;
}

function isStatelessComponent(vtype) {
  return vtype === VSTATELESS;
}

function isCommentElement(vtype) {
  return vtype === VCOMMENT;
}

function isImutableJSData(data) {
  return !!data.toJS;
}

/**
 * 创建一个虚拟节点
 * @param {String} [uid] 节点的唯一标识
 * @param {Number} vtype 1 = 文本 , 2 = 元素 , 3 = 无状态组件 , 4 = 有状态的组件 , 5 = 注释
 * @param {String | Component | Function} type [ 2 = 元素名称(标签名称) , 3 = 组件的构造器 , 4 = 组件构造函数]
 * @param {String} key 节点的键
 * @param {Object} props 节点的属性
 * @param {String | Function} ref
 * @returns {VNode}
 */
function createVnode(vtype, type, props, key, ref) {
  let vnode = {
    vtype: vtype,
    type: type,
    props: props,
    refs: refs, // 当前有状态组件的refs属性 ( 其他类型的虚拟节点 refs = null )
    key: key,
    ref: ref
  };

  if (vtype === VSTATELESS || vtype === VCOMPONENT) {
    vnode.uid = _.getUid();
  }

  return vnode;
}

/**
 * 根据模型 , 生成对应模型的上下文对象
 *
 * @param {Object} curContext 当前上下文
 * @param {Object} contextTypes 定义的上下文模型
 * @returns {Object}
 */
function getContextByTypes(curContext, contextTypes) {
  let context = {};

  if (!contextTypes || !curContext) {
    return context;
  }

  for (let key in contextTypes) {
    if (contextTypes.hasOwnProperty(key)) {
      context[key] = curContext[key];
    }
  }

  return context;
}

export {
  createVnode,
  initVnode,
  destroyVnode,
  compareTwoVnodes,
  syncCache,
  renderComponent,
  getChildContext,
  clearPending
};
