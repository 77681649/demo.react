import {
  SWITCH_TODO_COMPLETED,
  BECOME_EDITABLE,
  SAVE_TODO,
  NEW_TODO
} from "./actionTypes";

const INIT_STATE = {
  title: "观影指南",
  todos: [
    {
      editable: false,
      id: 1,
      content: "邪不压正",
      completed: false
    },
    {
      editable: false,
      id: 2,
      content: "三体",
      completed: false
    },
    {
      editable: false,
      id: 3,
      content: "阳光灿烂的日子",
      completed: false
    },
    {
      editable: false,
      id: 4,
      content: "红高粱",
      completed: false
    }
  ]
};

let newId = INIT_STATE.todos.length + 1;

export default function todolistReducer(state, action) {
  let { id, content } = action;
  switch (action.type) {
    case SWITCH_TODO_COMPLETED:
      var { completed } = action;
      var todos = state.todos.map(todo => {
        if (todo.id == id) {
          return { ...todo, completed };
        } else {
          return todo;
        }
      });

      todos.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      });

      return { ...state, todos };
    case BECOME_EDITABLE:
      var todos = state.todos.map(todo => {
        if (todo.id == id) {
          return { ...todo, editable: !todo.completed };
        } else {
          return todo;
        }
      });

      return { ...state, todos };
    case SAVE_TODO:
      var todos = state.todos.map(todo => {
        if (todo.id == id) {
          return { ...todo, content, editable: false };
        } else {
          return todo;
        }
      });

      return { ...state, todos };

    case NEW_TODO:
      return {
        ...state,
        todos: [].concat(state.todos, {
          id: newId++,
          content: content,
          completed: false
        })
      };
    default:
      return state || INIT_STATE;
  }
}
