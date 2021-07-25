import axios from "axios";
import { setAlert } from "./alert";

import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

export const register =(name, email, password) => async (dispatch) => {
    
  console.log("name", name);
  console.log("email", email);
  console.log("password", password);
     try {
       
        const config = {
            headers: {
              "Content-Type": "application/json",
            }
          };
          console.log("header", config)
          const newUser = {
            name,
            email,
            password,
          }; 
          const body = JSON.stringify(newUser);
          console.log("body", body)
          const res = await axios.post("/api/users", body, config);

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
