import { bindActionCreators } from "redux";
import { requestCityList } from "../services/city";
import { requestWeather } from "../services/weather";
import {
  FETCH_WEATHER,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_ERROR,
  FETCH_CITYLIST,
  FETCH_CITYLIST_SUCCESS,
  FETCH_CITYLIST_ERROR,
  SELECT_CITY
} from "../actionTypes";
import store from "../appStore";

export default bindActionCreators(
  {
    fetchCityList() {
      return dispatch => {
        dispatch({
          type: FETCH_CITYLIST
        });

        requestCityList()
          .then(citylist =>
            dispatch({ type: FETCH_CITYLIST_SUCCESS, payload: citylist })
          )
          .catch(err => dispatch({ type: FETCH_CITYLIST_ERROR, err }));
      };
    },

    selectCity(city) {
      return { type: SELECT_CITY, city };
    },

    fetchWeather(cityID) {
      return dispatch => {
        dispatch({
          type: FETCH_WEATHER
        });

        requestWeather(cityID)
          .then(weather =>
            dispatch({ type: FETCH_WEATHER_SUCCESS, payload: weather })
          )
          .catch(err => dispatch({ type: FETCH_WEATHER_ERROR, err }));
      };
    }
  },
  store.dispatch
);
