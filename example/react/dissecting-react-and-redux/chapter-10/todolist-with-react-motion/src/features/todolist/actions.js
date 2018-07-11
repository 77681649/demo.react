import {
  SWITCH_TODO_COMPLETED,
  BECOME_EDITABLE,
  SAVE_TODO,
  NEW_TODO
} from "./actionTypes";

export function switchCompleted(id, completed) {
  return {
    type: SWITCH_TODO_COMPLETED,
    id,
    completed
  };
}

export function becomeEditable(id) {
  return {
    type: BECOME_EDITABLE,
    id
  };
}

export function newTodo(content) {
  return {
    type: NEW_TODO,
    content
  };
}

export function saveTodo(id, content) {
  return {
    type: SAVE_TODO,
    id,
    content
  };
}
