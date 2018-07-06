import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../components/Header";
// import { switchCompleted } from "../actions";

export default connect(
  function mapStateToProps({ todolist: state }) {
    return {
      mainTitle: state.title,
      subTitle: state.todos.length,
      showEditButton: state.todos.length > 0
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
)(Header);
