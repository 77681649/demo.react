import {
  FETCH_CITYLIST,
  FETCH_CITYLIST_SUCCESS,
  FETCH_CITYLIST_ERROR,
  SELECT_CITY
} from "../actionTypes";
import { LOADING, SUCCESS, ERROR } from "../status";

const INITILIZE_STATE = {
  status: "",
  selected: "101280601",
  data: null
};

export default (state, action) => {
  switch (action.type) {
    case FETCH_CITYLIST:
      return { ...state, status: LOADING };
    case FETCH_CITYLIST_SUCCESS:
      return { ...state, data: action.payload, status: SUCCESS };
    case FETCH_CITYLIST_ERROR:
      return { ...state, err: action.err, status: ERROR };
    case SELECT_CITY:
      return { ...state, selected: action.city };
    default:
      return state || INITILIZE_STATE;
  }
};
