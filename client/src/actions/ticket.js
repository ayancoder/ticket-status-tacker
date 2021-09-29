import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { GET_POSTS, GET_POST, ADD_POST } from "./types";

export const tickets = (state, page, limit, totalPage) => async (dispatch) => {
  try {
    console.log("Page " + page);
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get(
      "http://143.244.131.27:5000/api/tickets?state=" +
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

export const addtickets = (subject, source, files) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    //Uploading the images/pdf
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
      data.append("image", files[i]);
    }

    const config = {
      headers: {
        "content-Type": "multipart/form-data",
      },
    };
    const res_upload = await axios.post(
      "http://143.244.131.27:5000/api/images/upload",
      data,
      config
    );
    console.log(res_upload.data.img);
    console.log(res_upload.data.pdf);
    var pdfFilePath = res_upload.data.pdf;
    var imageFilePath = res_upload.data.img;

    // Adding  ticket

    const config_ticket = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("header", config);
    const NewTicket = {
      subject,
      source,
      pdfFilePath,
      imageFilePath,
    };
    const body = JSON.stringify(NewTicket);
    console.log("body", body);
    const res = await axios.post(
      "http://143.244.131.27:5000/api/tickets",
      body,
      config_ticket
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
