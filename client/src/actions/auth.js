import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, 
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from "./types";

// Load User
export const loadUser = () => async dispatch => {

  if(localStorage.token){
    setAuthToken(localStorage.token)
  }
  try {
    const res = await axios.get("/api/auth")

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register =(name, email, password, phone) => async (dispatch) => {
  
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
            phone
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


  export const login =(email,password) => async (dispatch) => {

    try{
      const cred = {
        email,
        password,
      };
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      const body = JSON.stringify(cred);
      const res = await axios.post("/api/auth", body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());

    }catch(err){
      console.log('err->',err)
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  };

  export const logout = () => dispatch => {
    
  }