import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  FETCH_USERS_SUCCESS,
  LOGOUT,
  LOGIN_ALERT_CLOSE,
  LOGIN_ALERT_OPEN,
} from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("http://143.244.131.27:5000/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register = (name, password, phone) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("header", config);
    const newUser = {
      name,

      password,
      phone,
    };
    const body = JSON.stringify(newUser);
    console.log("body", body);
    const res = await axios.post(
      "http://143.244.131.27:5000/api/users",
      body,
      config
    );

    console.log("successful post of user");
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log("failed post ", err);
    //const errors = err.response.data.errors;

    //if (errors) {
    // errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    //}

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const login = (password, phone) => async (dispatch) => {
  try {
    const cred = {
      password,
      phone,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(cred);
    const res = await axios.post(
      "http://143.244.131.27:5000/api/auth",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_ALERT_OPEN,
      alertMsg: err?.response?.data?.errors[0]?.msg,
    });
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const fetchAllDealingOfficer = () => async (dispatch) => {
  try {
    const res = await axios.get("http://143.244.131.27:5000/api/users");
    console.log(res);
    if (res) {
      dispatch({
        type: FETCH_USERS_SUCCESS,
        dealingOfficers: res?.data,
      });
    }
  } catch (e) {}
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const closeSnackBar = () => async (dispatch) => {
  dispatch({
    type: LOGIN_ALERT_CLOSE,
  });
};
