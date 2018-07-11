import { connect } from "react-redux";
import Weather from "../components/Weather";
import actions from "../actions";

export default connect(
  ({ weather, citylist }) => ({
    cityID: citylist.selected,
    ...weather
  }),
  () => {
    return { fetchWeather: actions.fetchWeather };
  }
)(Weather);
