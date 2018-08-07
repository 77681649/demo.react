export {setAutoFreeze, setUseProxies} from "./common"

import {applyPatches as applyPatchesImpl} from "./patches"
import {isProxyable, getUseProxies} from "./common"
import {produceProxy} from "./proxy"
import {produceEs5} from "./es5"

/**
 * 
 * 
 * 该函数能自由的改变状态, 因为它将创建写入时的副本("写时拷贝").
 * 这意味着, 原始的状态将保持不变, 一旦函数完成, 则返回修改的状态
 * 
 * produce takes a state, and runs a function against it.
 * 
 * @export
 * @param {any} baseState - 初始状态
 * @param {Function} producer - 接受可以自由修改的baseState代理作为第一个参数的函数 (draft) => newState
 * @param {Function} patchListener - [可选]  optional function that will be called with all the patches produces here
 * @returns {any} 如果没有修改,则返回baseState,否则返回修改之后的newState
 */
export function produce(baseState, producer, patchListener) {
    // prettier-ignore
    if (arguments.length < 1 || arguments.length > 3) throw new Error("produce expects 1 to 3 arguments, got " + arguments.length)

    // curried invocation
    if (typeof baseState === "function") {
        // prettier-ignore
        if (typeof producer === "function") throw new Error("if first argument is a function (curried invocation), the second argument to produce cannot be a function")

        const initialState = producer
        const recipe = baseState

        return function() {
            const args = arguments

            const currentState =
                args[0] === undefined && initialState !== undefined
                    ? initialState
                    : args[0]

            return produce(currentState, draft => {
                args[0] = draft // blegh!
                return recipe.apply(draft, args)
            })
        }
    }

    // prettier-ignore
    {
        if (typeof producer !== "function") throw new Error("if first argument is not a function, the second argument to produce should be a function")
        if (patchListener !== undefined && typeof patchListener !== "function") throw new Error("the third argument of a producer should not be set or a function")
    }

    // if state is a primitive, don't bother proxying at all
    if (typeof baseState !== "object" || baseState === null) {
        const returnValue = producer(baseState)
        return returnValue === undefined ? baseState : returnValue
    }

    if (!isProxyable(baseState))
        throw new Error(
            `the first argument to an immer producer should be a primitive, plain object or array, got ${typeof baseState}: "${baseState}"`
        )

    return !getUseProxies()
        ? produceProxy(baseState, producer, patchListener)
        : produceEs5(baseState, producer, patchListener)
}

export default produce

export const applyPatches = produce(applyPatchesImpl)
