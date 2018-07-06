import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SwitchLabel from "../components/SwitchLabel";
import { switchCompleted } from "../actions";

const genText = showCompleted => {
  let tag = showCompleted ? "隐藏" : "显示";
  return `${tag}已完成的项目`;
};

export default connect(
  function mapStateToProps(state) {
    return {
      text: genText(state.filter.showCompleted)
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        onClick: switchCompleted
      },
      dispatch
    );
  }
)(SwitchLabel);
