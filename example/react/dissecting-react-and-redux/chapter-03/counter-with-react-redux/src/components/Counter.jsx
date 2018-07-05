import React from "react";

export default ({ value, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>+</button>&nbsp;&nbsp;Counter:{value}
    </div>
  );
};
