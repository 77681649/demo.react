import { connect } from "react-redux";
import Counter from "../components/Counter";
import actions from "../actions";

export default connect(
  function mapStateToProps(state) {
    return { value: state };
  },
  function mapDispatchToProps() {
    return {
      onClick: actions.increment
    };
  }
)(Counter);
