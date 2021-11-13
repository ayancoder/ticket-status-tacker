import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import ticket from "./ticket";
import generate from "./generate";

export default combineReducers({
  alert,
  auth,
  ticket,
  generate,
});
