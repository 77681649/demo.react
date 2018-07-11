import React, { Component } from "react";
import { LOADING, SUCCESS, ERROR } from "../status";

export default class Weather extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchCityList(this.props.cityID);
  }

  render() {
    switch (this.props.status) {
      case LOADING:
        return <span>请求中...</span>;
      case SUCCESS:
        let { data } = this.props;

        return (
          <select onChange={this.handleChange} value={this.props.selected}>
            {data
              ? data.map(({ id, name }) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })
              : null}
          </select>
        );
      case ERROR:
        return <span>请求失败</span>;
      default:
        return null;
    }
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }
}
