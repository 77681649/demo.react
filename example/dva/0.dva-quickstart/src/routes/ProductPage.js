import React from "react";
import { connect } from "dva";
import ProductList from "../containers/ProductList";

function ProductPage() {
  return (
    <div>
      <h2>List Of Products</h2>
      <ProductList />
    </div>
  );
}

export default connect()(ProductPage);
