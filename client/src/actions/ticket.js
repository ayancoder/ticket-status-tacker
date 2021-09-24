import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { GET_POSTS, GET_POST, ADD_POST } from "./types";

export const tickets = (state, page, limit) => async (dispatch) => {
  try {
    console.log("Page " + page);
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get(
      "http://localhost:5000/api/tickets?state=" +
        state +
        "&page=" +
        page +
        "&limit=" +
        limit
    );

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    console.log("failed get ", err);
    //const errors = err.response.data.errors;

    //if (errors) {
    // errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    //}

    //   dispatch({
    //     type: REGISTER_FAIL,
    //   });
  }
};

export const addtickets = (subject, source, imagePath) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("header", config);
    const NewTicket = {
      subject,
      source,
      imagePath,
    };
    const body = JSON.stringify(NewTicket);
    console.log("body", body);
    const res = await axios.post(
      "http://localhost:5000/api/tickets",
      body,
      config
    );

    console.log("successful added ticket");
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
  } catch (err) {
    console.log("failed to create ticket ", err);
    //const errors = err.response.data.errors;

    //if (errors) {
    // errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    //}

    //   dispatch({
    //     type: REGISTER_FAIL,
    //   });
  }
};
