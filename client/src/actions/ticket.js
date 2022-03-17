import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  GET_COUNT,
  ALERT_OPEN,
  ALERT_CLOSE,
  FETCH_COMMENTS,
} from "./types";
import ticket from "../reducers/ticket";

export const tickets =
  (state, page, limit, assign, subject) => async (dispatch) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      var fetchTicket =
        `http://${process.env.REACT_APP_SERVER}:5000/api/tickets?state=` +
        state +
        "&page=" +
        page +
        "&limit=" +
        limit;
      if (assign != null) {
        fetchTicket = fetchTicket + "&assign=" + assign;
      }
      if (subject != null) {
        fetchTicket = fetchTicket + "&subject=" + subject;
      }
      const res = await axios.get(fetchTicket);

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
export const getTicketComments = (ticketId) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get(
      `http://${process.env.REACT_APP_SERVER}:5000/api/tickets/ticket_id/` + ticketId
    );
    if (res) {
      console.log(res.data.comments);
      dispatch({
        type: FETCH_COMMENTS,
        comments: res.data.comments,
      });
    }
  } catch (e) {}
};

export const editTickets =
  (ticketId, assigneeId, priority, commentText, user, state) =>
  async (dispatch) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      var res = null;
      if (user === "BDO") {
        var body = {
          assigneeId,
          priority,
          commentText,
        };
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        body = JSON.stringify(body);
        res = await axios.put(
          `http://${process.env.REACT_APP_SERVER}:5000/api/tickets/assign/` + ticketId,
          body,
          config
        );
      } else if (user === "DEALING_OFFICER") {
        var dealBody = {
          state,
        };
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        dealBody = JSON.stringify(dealBody);
        res = await axios.put(
          `http://${process.env.REACT_APP_SERVER}:5000/api/tickets/` + ticketId,
          dealBody,
          config
        );

        body = {
          commentText,
        };

        body = JSON.stringify(body);
        const resComment = await axios.post(
          `http://${process.env.REACT_APP_SERVER}:5000/api/tickets/comment/` + ticketId,
          body,
          config
        );
      }
      dispatch({
        type: ALERT_OPEN,
        alertOpen: true,
      });
    } catch (e) {}
  };

export const addComments = (ticketId, commentText) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    var body = {
      commentText,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    body = JSON.stringify(body);
    const res = await axios.post(
      `http://${process.env.REACT_APP_SERVER}:5000/api/tickets/comment/` + ticketId,
      body,
      config
    );
    if (res) {
      console.log(res);
    }
  } catch (e) {}
};

export const getcountticketstypes = () => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get(`http://${process.env.REACT_APP_SERVER}:5000/api/tickets/count`);
    if (res) {
      var newTickets =
        res?.data?.newTicket === undefined ? 0 : res?.data?.newTicket;
      var openTickets =
        res?.data?.inprogressTicket === undefined
          ? 0
          : res?.data?.inprogressTicket;
      var resolvedTickets =
        res?.data?.resolvedTicket === undefined ? 0 : res?.data?.resolvedTicket;
      var assignedTickets =
        res?.data?.assignedTicket === undefined ? 0 : res?.data?.assignedTicket;
      dispatch({
        type: GET_COUNT,
        stateTickets: {
          newTickets,
          openTickets,
          resolvedTickets,
          assignedTickets,
        },
      });
    }
  } catch (e) {
    console.log(e);
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
      `http://${process.env.REACT_APP_SERVER}:5000/api/images/upload`,
      data,
      config
    );
    var pdfFilePath = res_upload.data.pdf;
    var imageFilePath = res_upload.data.img;

    // Adding  ticket

    const config_ticket = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("header", config_ticket);
    const NewTicket = {
      subject,
      source,
      pdfFilePath,
      imageFilePath,
    };
    const body = JSON.stringify(NewTicket);
    console.log("body", body);
    const res = await axios.post(
      `http://${process.env.REACT_APP_SERVER}:5000/api/tickets`,
      body,
      config_ticket
    );

    console.log("successful added ticket");
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch({
      type: ALERT_OPEN,
      alertOpen: true,
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

export const closeSnackBar = () => async (dispatch) => {
  dispatch({
    type: ALERT_CLOSE,
  });
};
