import React from "react";
import { connect } from "dva";
import AddTodo from "../components/AddTodo";
import TodoList from "../components/TodoList";

const ConnectedTodoList = connect(
  ({ todos }) => ({ todos }),
  dispatch => {
    return {
      onTodoDelete: id => {
        dispatch({ type: "todos/delayDelete", id });
      }
    };
  }
)(TodoList);

const ConnectedAddTodo = connect(
  null,
  dispatch => ({
    onTodoAdd: text => {
      dispatch({ type: "todos/add", text });
    }
  })
)(AddTodo);

function IndexPage() {
  return (
    <div>
      <ConnectedAddTodo />
      <ConnectedTodoList />
    </div>
  );
}

export default connect()(IndexPage);
