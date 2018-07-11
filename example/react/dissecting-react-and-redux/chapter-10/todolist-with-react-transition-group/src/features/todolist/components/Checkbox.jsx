import React, { Component } from "react";
import "./Checkbox.css";

export default class Checkbox extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { checked: props.checked };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    let { id, disabled, text, onChange, children } = this.props;
    let { checked } = this.state;

    return (
      <div className="checkbox">
        <input
          id={id}
          type="checkbox"
          className="raw"
          disabled={disabled}
          onChange={() => void 666}
          checked={checked}
        />
        <label onClick={this.handleClick} htmlFor={id}>
          {text || children}
        </label>
      </div>
    );
  }

  handleClick(e) {
    let nextChecked = !this.state.checked;
    this.setState({ checked: nextChecked });
    this.handleChange(nextChecked);
  }

  handleChange(checked) {
    this.props.onChange && this.props.onChange(checked);
  }
}
