import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  LOGOUT,
  FETCH_USERS_SUCCESS,
  LOGIN_ALERT_CLOSE,
  LOGIN_ALERT_OPEN,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  alertOpen: false,
  alertMsg: "",
  dealingOfficers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        dealingOfficers: action.dealingOfficers,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGIN_ALERT_OPEN:
      return {
        ...state,
        alertOpen: true,
        alertMsg: action.alertMsg,
      };
    case LOGIN_ALERT_CLOSE:
      return {
        ...state,
        alertOpen: false,
      };
    default:
      return state;
  }
}
