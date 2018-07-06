import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import TodoList from "../components/TodoList";
// import { switchCompleted } from "../actions";

export default connect(
  function mapStateToProps(state) {
    let showCompleted = state.filter.showCompleted;

    return {
      data: state.todolist.todos.filter(
        todo => (showCompleted ? true : !todo.data.completed)
      )
    };
  },
  function mapDispatchToProps(dispatch) {
    // return bindActionCreators(
    //   {
    //     onClick: switchCompleted
    //   },
    //   dispatch
    // );
    return {};
  }
)(TodoList);
