/**
 * 使用immer实现reducer
 */
import {createStore} from "redux"
import {produce} from "../immer"

//
// original reducer
//
// function reducer(state, action) {
//     switch (action.type) {
//         case "complete_todo":
//             const todos = [].concat(state.todos)

//             return {
//                 ...state,
//                 todos: todos.map(todo => {
//                     if (todo.id === action.id) {
//                         todo.done = true
//                     }

//                     return todo
//                 })
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
            case "complete_todo":
                const index = draft.todos.findIndex(
                    todo => todo.id === action.id
                )
                if (~index) {
                    draft.todos[index].done = true
                }
                break
            // 不需要, 默认就是返回原始的state
            // default:
            //     return state
        }
    })
}

const store = createStore(reducer, {
    showCompleted: false,
    todos: [
        {id: 1, name: "todo1", done: false},
        {id: 2, name: "todo2", done: false},
        {id: 3, name: "todo3", done: false}
    ]
})

const prevState = store.getState()

store.dispatch({
    type: "complete_todo",
    id: 2
})

const nextState = store.getState()

console.log("prevState", prevState)
console.log("nextState", nextState)
