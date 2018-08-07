/**
 * produce
 * ES5 基于Object.defineProperty
 */
"use strict"
// @ts-check

import {
    is,
    isProxyable,
    isProxy,
    PROXY_STATE,
    shallowCopy,
    RETURNED_AND_MODIFIED_ERROR,
    each,
    finalize
} from "./common"

/**
 * @typedef ImmerState
 * @property {Boolean} [modified=false] base是否被修改过
 * @property {Object} [assigned={}] // true: value was assigned to these props, false: was removed
 * @property {Object} parent 
 * @property {Object} base
 * @property {Object} proxy
 * @property {Boolean} [hasCopy=false] 是否有draft
 * @property {Object} [copy=undefined] draft
 * @property {Boolean} [finalizing=false]
 * @property {Boolean} [finalized=false]
 * @property {Boolean} [finished=false]
 */

/**
 * 缓存 代理属性描述符对象
 */
const descriptors = {}

/**
 * 缓存
 * @type {ImmerState}
 */
let states = null

/**
 * @param {Object} parent
 * @param {Object} proxy
 * @param {Object} base 
 * @returns {ImmerState} 
 */
function createState(parent, proxy, base) {
    return {
        modified: false,
        assigned: {}, // true: value was assigned to these props, false: was removed
        hasCopy: false,
        parent,
        base,
        proxy,
        copy: undefined,
        finished: false,
        finalizing: false,
        finalized: false
    }
}

/**
 * 获得原始值
 * @param {ImmerState} state 状态
 * @returns {Any} 返回原始值
 */
function source(state) {
    return state.hasCopy ? state.copy : state.base
}

/**
 * 获得属性值
 * @param {ImmerState} state 状态
 * @param {String} prop 属性名
 * @returns {Any} 返回属性值
 */
function get(state, prop) {
    assertUnfinished(state)

    // 获得原始值
    const value = source(state)[prop]

    //
    if (!state.finalizing && 
        value === state.base[prop] && 
        isProxyable(value)) {
        // only create a proxy if the value is proxyable, and the value was in the base state
        // if it wasn't in the base state, the object is already modified and we will process it in finalize
        prepareCopy(state)
        return (state.copy[prop] = createProxy(state, value))
    }

    return value
}

/**
 *
 * @param {ImmerState} state
 * @param {String} prop
 * @param {Any} value
 */
function set(state, prop, value) {
    assertUnfinished(state)


    state.assigned[prop] = true // optimization; skip this if there is no listener
    
    // 判断是否变化过
    if (!state.modified) {
        // 过滤掉无效的修改
        if (is(source(state)[prop], value)) return

        // 标记修改
        markChanged(state)

        // 创建拷贝
        prepareCopy(state)
    }
    
    state.copy[prop] = value
}

/**
 * 标记修改 - 不光标记自身, 还要标记它的父对象
 * @param {ImmerState} state
 */
function markChanged(state) {
    if (!state.modified) {
        state.modified = true
        if (state.parent) markChanged(state.parent)
    }
}

/**
 * 预拷贝 - 为base创建一个副本
 * @param {ImmerState} state
 */
function prepareCopy(state) {
    // 如果有拷贝, 则退出
    if (state.hasCopy) return

    state.hasCopy = true
    state.copy = shallowCopy(state.base)
}

/**
 * 创建一个代理对象
 * 
 * @param {Object} parent 
 * @param {Object} base 原始对象(被代理对象)
 * @returns {Object} 返回base对象的代理
 */
function createProxy(parent, base) {
    /**
     * 创建代理对象
     */
    const proxy = shallowCopy(base)

    /**
     * 创建代理属性
     */
    each(base, keyOrIndex => {
        const proxyProp = "" + keyOrIndex
        Object.defineProperty(proxy, proxyProp, createPropertyProxy(proxyProp))
    })

    /**
     * 
     */
    const state = createState(parent, proxy, base)
    createHiddenProperty(proxy, PROXY_STATE, state)
    states.push(state)
    
    return proxy
}

/**
 * 创建属性代理
 * @param {String} prop 代理属性名
 * @returns {Object} 返回属性描述符
 */
function createPropertyProxy(prop) {
    return (
        descriptors[prop] ||
        (descriptors[prop] = {
            configurable: true,
            enumerable: true,
            get() {
                return get(this[PROXY_STATE], prop)
            },
            set(value) {
                set(this[PROXY_STATE], prop, value)
            }
        })
    )
}

/**
 * 断言是否完成
 * @param {ImmerState} state
 */
function assertUnfinished(state) {
    if (state.finished === true)
        throw new Error(
            "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " +
                JSON.stringify(state.copy || state.base)
        )
}

// this sounds very expensive, but actually it is not that expensive in practice
// as it will only visit proxies, and only do key-based change detection for objects for
// which it is not already know that they are changed (that is, only object for which no known key was changed)

/**
 *
 */
function markChangesSweep() {
    // intentionally we process the proxies in reverse order;
    // ideally we start by processing leafs in the tree, because if a child has changed, we don't have to check the parent anymore
    // reverse order of proxy creation approximates this
    for (let i = states.length - 1; i >= 0; i--) {
        const state = states[i]
        if (state.modified === false) {
            if (Array.isArray(state.base)) {
                if (hasArrayChanges(state)) markChanged(state)
            } else if (hasObjectChanges(state)) markChanged(state)
        }
    }
}

/**
 *
 */
function markChangesRecursively(object) {
    if (!object || typeof object !== "object") return
    const state = object[PROXY_STATE]
    if (!state) return
    const {proxy, base} = state
    if (Array.isArray(object)) {
        if (hasArrayChanges(state)) {
            markChanged(state)
            state.assigned.length = true
            if (proxy.length < base.length)
                for (let i = proxy.length; i < base.length; i++)
                    state.assigned[i] = false
            else
                for (let i = base.length; i < proxy.length; i++)
                    state.assigned[i] = true
            each(proxy, (index, child) => {
                if (!state.assigned[index]) markChangesRecursively(child)
            })
        }
    } else {
        const {added, removed} = diffKeys(base, proxy)
        if (added.length > 0 || removed.length > 0) markChanged(state)
        each(added, (_, key) => {
            state.assigned[key] = true
        })
        each(removed, (_, key) => {
            state.assigned[key] = false
        })
        each(proxy, (key, child) => {
            if (!state.assigned[key]) markChangesRecursively(child)
        })
    }
}

/**
 *
 * @param {*} from
 * @param {*} to
 */
function diffKeys(from, to) {
    // TODO: optimize
    const a = Object.keys(from)
    const b = Object.keys(to)
    return {
        added: b.filter(key => a.indexOf(key) === -1),
        removed: a.filter(key => b.indexOf(key) === -1)
    }
}

/**
 *
 */
function hasObjectChanges(state) {
    const baseKeys = Object.keys(state.base)
    const keys = Object.keys(state.proxy)
    return !shallowEqual(baseKeys, keys)
}

/**
 *
 */
function hasArrayChanges(state) {
    const {proxy} = state
    if (proxy.length !== state.base.length) return true
    // See #116
    // If we first shorten the length, our array interceptors will be removed.
    // If after that new items are added, result in the same original length,
    // those last items will have no intercepting property.
    // So if there is no own descriptor on the last position, we know that items were removed and added
    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
    // the last one
    const descriptor = Object.getOwnPropertyDescriptor(proxy, proxy.length - 1)
    // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)
    if (descriptor && !descriptor.get) return true
    // For all other cases, we don't have to compare, as they would have been picked up by the index setters
    return false
}

/**
 *
 * @param {Any} baseState
 * @param {Function} producer
 * @param {Function} patchListener
 * @returns {Any}
 */
export function produceEs5(baseState, producer, patchListener) {
    // 如果已经代理了, 那么直接执行
    if (isProxy(baseState)) {
        // See #100, don't nest producers
        const returnValue = producer.call(baseState, baseState)
        return returnValue === undefined ? baseState : returnValue
    }

    /**
     * 之前的状态 - 用于回滚
     */
    const prevStates = states

    /**
     *
     */
    const patches = patchListener && []

    /**
     *
     */
    const inversePatches = patchListener && []

    states = []

    try {
        // create proxy for root
        const rootProxy = createProxy(undefined, baseState)

        // execute the thunk
        const returnValue = producer.call(rootProxy, rootProxy)

        // and finalize the modified proxy
        each(states, (_, state) => {
            state.finalizing = true
        })

        let result
        
        // check whether the draft was modified and/or a value was returned
        if (returnValue !== undefined && returnValue !== rootProxy) {
            // something was returned, and it wasn't the proxy itself
            if (rootProxy[PROXY_STATE].modified)
                throw new Error(RETURNED_AND_MODIFIED_ERROR)
                
            result = finalize(returnValue)
            
            if (patches) {
                patches.push({op: "replace", path: [], value: result})
                inversePatches.push({op: "replace", path: [], value: baseState})
            }
        } else {
            if (patchListener) markChangesRecursively(rootProxy)
            markChangesSweep() // this one is more efficient if we don't need to know which attributes have changed
            result = finalize(rootProxy, [], patches, inversePatches)
        }

        // make sure all proxies become unusable
        each(states, (_, state) => {
            state.finished = true
        })
        
        patchListener && patchListener(patches, inversePatches)

        return result
    } finally {
        // 回滚到之前的状态
        states = prevStates
    }
}

/**
 *
 * @param {*} objA
 * @param {*} objB
 */
function shallowEqual(objA, objB) {
    //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (is(objA, objB)) return true
    if (
        typeof objA !== "object" ||
        objA === null ||
        typeof objB !== "object" ||
        objB === null
    ) {
        return false
    }
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)
    if (keysA.length !== keysB.length) return false
    for (let i = 0; i < keysA.length; i++) {
        if (
            !hasOwnProperty.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false
        }
    }
    return true
}

/**
 * 为指定target创建隐藏属性(不能被遍历)
 * @param {Object} target 目标对象
 * @param {String} prop 属性名
 * @param {Any} value 属性值
 */
function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
        value: value,
        // 不可被遍历
        enumerable: false,

        // 可写
        writable: true
    })
}
