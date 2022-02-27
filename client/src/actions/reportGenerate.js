import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import { REPORT_FETCH_FAIL, REPORT_FETCH_SUCCESS } from "./types";

export const generate_report =
  (state, startDate, endDate) => async (dispatch) => {
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
        state,
        startDate,
        endDate,
      };
      const body = JSON.stringify(NewTicket);
      console.log("body", body);
      const res = await axios.post(
        "http://localhost:5000/api/reports",
        body,
        config
      );

      dispatch({
        type: REPORT_FETCH_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.log("failed get ", err);
      dispatch({
        type: REPORT_FETCH_FAIL,
        payload: err,
      });
    }
  };
