import axios from "axios";
import { setAlert } from "./alert";

import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

export const register =({ name, email, password }) => async (dispatch) => {


    const newUser = {
      name,
      email,
      password,
    };

    try {
        const config = {
            headers: {
              "Content-Type": "application/json",
            }
          };
          const body = JSON.stringify(newUser);
          const res = await axios.post("/api/users/", body, config);

      console.log("successful post of user");
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.log("failed post ", err);
     /*  const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      } */

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
