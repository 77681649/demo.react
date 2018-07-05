import propTypes from "prop-types";

export default propTypes.shape({
  getState: propTypes.func.isRequired,
  dispatch: propTypes.func.isRequired,
  subscribe: propTypes.func.isRequired
});
