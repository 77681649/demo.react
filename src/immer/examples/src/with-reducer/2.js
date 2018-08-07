/**
 * 使用immer实现reducer deepUpdate
 */
import {createStore} from "redux"
import {produce} from "../immer"

const preloadedState = {
    user: {
        name: "tyossss",
        age: 27,
        address: {
            province: "GuangDong",
            city: "ChangSha"
        }
    }
}

//
// original reducer
//
// function reducer(state, action) {
//     switch (action.type) {
//         case "increment_age":
//             return {
//                 ...state,
//                 user: {
//                     ...state.user,
//                     age: state.user.age + 1
//                 }
//             }
//             break
//         case "update_address_city":
//             return {
//                 ...state,
//                 user: {
//                     ...state.user,
//                     address: {
//                         ...state.address,
//                         city: action.city
//                     }
//                 }
//             }
//             break
//         default:
//             return state
//     }
// }

//
// with immer
//
function reducer(state, action) {
    return produce(state, draft => {
        switch (action.type) {
            case "increment_age":
                draft.user.age++
                break
            case "update_address_city":
                draft.user.address.city = action.city
                break
            // 不需要, 默认就是返回原始的state
            // default:
            //     return state
        }
    })
}

const store = createStore(reducer, preloadedState)

const prevState = store.getState()

store.dispatch({
    type: "increment_age"
})

store.dispatch({
    type: "update_address_city",
    city: "ShenZhen"
})

const nextState = store.getState()

console.log("prevState", prevState)
console.log("nextState", nextState)
