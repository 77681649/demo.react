import React, { Component } from "react";
import Counter from "../components/Counter";
import { connect } from "../react-redux";

export default connect(function mapStateToProps(state, props) {
  return {
    count: state[props.index]
  };
})(Counter);
