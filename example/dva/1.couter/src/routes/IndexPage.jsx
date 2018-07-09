import React from "react";
import { connect } from "dva";

function IndexPage({ count, onIncrenment, onIncrenmentWithDelay }) {
  return (
    <div>
      <button onClick={onIncrenmentWithDelay}>延迟+1</button>
      <button onClick={onIncrenment}>+1</button>
      <span>Counter:{count}</span>
    </div>
  );
}

export default connect(
  ({ counter }) => ({ count: counter }),
  dispatch => {
    return {
      onIncrenment: () =>
        dispatch({
          type: "counter/increment"
        }),
      onIncrenmentWithDelay: () =>
        dispatch({
          type: "counter/addAfter1Second"
        })
    };
  }
)(IndexPage);
