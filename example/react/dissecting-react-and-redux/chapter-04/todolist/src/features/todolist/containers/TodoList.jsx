import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import TodoList from "../components/TodoList";
import { switchCompleted, becomeEditable, saveTodo, newTodo } from "../actions";

export default connect(
  function mapStateToProps(state) {
    let showCompleted = state.filter.showCompleted;

    return {
      data: state.todolist.todos.filter(
        todo => (showCompleted ? true : !todo.completed)
      )
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        onSwitchCompleted: switchCompleted,
        onEditable: becomeEditable,
        onEditCompleted: saveTodo,
        onCreateCompleted: newTodo
      },
      dispatch
    );
  }
)(TodoList);
