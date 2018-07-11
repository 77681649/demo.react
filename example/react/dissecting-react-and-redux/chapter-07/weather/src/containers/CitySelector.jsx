import { connect } from "react-redux";
import CitySelector from "../components/CitySelector";
import actions from "../actions";

export default connect(
  ({ citylist }) => citylist,
  () => {
    return {
      fetchCityList: actions.fetchCityList,
      onChange: city => {
        actions.selectCity(city);
        actions.fetchWeather(city);
      }
    };
  }
)(CitySelector);
