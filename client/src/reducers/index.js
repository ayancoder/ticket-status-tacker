import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import ticket from "./ticket";

export default combineReducers({
  alert,
  auth,
  ticket,
});
