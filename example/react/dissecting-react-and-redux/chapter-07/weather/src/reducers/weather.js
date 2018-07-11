import {
  FETCH_WEATHER,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_ERROR,
  SELECT_CITY
} from "../actionTypes";
import { LOADING, SUCCESS, ERROR } from "../status";

const INITILIZE_STATE = {
  status: "",
  data: null
};

export default (state, action) => {
  switch (action.type) {
    case FETCH_WEATHER:
      return { ...state, status: LOADING };
    case FETCH_WEATHER_SUCCESS:
      return { ...state, data: action.payload.weatherinfo, status: SUCCESS };
    case FETCH_WEATHER_ERROR:
      return { ...state, err: action.err, status: ERROR };
    default:
      return state || INITILIZE_STATE;
  }
};
