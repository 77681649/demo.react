import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <ul>
    <li key="/">
      <Link to="/">Home</Link>
    </li>
    <li key="/about">
      <Link to="/about">About</Link>
    </li>
    <li key="/contacts">
      <Link to="/contacts">Contacts</Link>
    </li>
  </ul>
);
