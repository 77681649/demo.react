import { connect } from "dva";
import ProductList from "../components/ProductList";

export default connect(
  function mapStateToProps({ products }) {
    return { products };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onDelete: id =>
        dispatch({
          type: "products/delete",
          payload: id
        })
    };
  }
)(ProductList);
