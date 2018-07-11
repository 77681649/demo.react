import React, { Component } from "react";
import { LOADING, SUCCESS, ERROR } from "../status";

export default class Weather extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.fetchWeather(this.props.cityID);
  }

  render() {
    let element = null;
    debugger
    switch (this.props.status) {
      case LOADING:
        element = <span>请求中...</span>;
        break;
      case SUCCESS:
        element = this.renderWeatherInfo();
        break;
      case ERROR:
        element = <span>请求失败</span>;
    }

    return <div>{element}</div>;
  }

  renderWeatherInfo() {
    let info = this.props.data;
    let element = null;

    if (info) {
      let children = [];

      if (info.city) {
        children.push(<dt key={`city-dt`}>城市:</dt>);
        children.push(<dd key={`city-dd`}>{info.city}</dd>);
      }

      if (info.weather) {
        children.push(<dt key={`weather-dt`}>天气:</dt>);
        children.push(<dd key={`weather-dd`}>{info.weather}</dd>);
      }

      if (info.temp1) {
        children.push(<dt key={`temp-dt`}>温度:</dt>);
        children.push(
          <dd key={`temp-dd`}>
            {info.temp1}~{info.temp2}
          </dd>
        );
      }

      element = <dl>{children}</dl>;
    }

    return element;
  }
}
