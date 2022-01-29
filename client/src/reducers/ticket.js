import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  GET_COUNT,
  ALERT_CLOSE,
  ALERT_OPEN,
  FETCH_COMMENTS,
} from "../actions/types";

const initialState = {
  ticket: null,
  tickets: [],
  loading: true,
  alertOpen: false,
  error: {},
  comments: [],
  stateTickets: {
    newTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    assignedTickets: 0,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_COMMENTS:
      return { ...state, comments: action.comments };
    case ALERT_OPEN:
      return {
        ...state,
        alertOpen: action.alertOpen,
      };
      break;
    case ALERT_CLOSE:
      return {
        ...state,
        alertOpen: false,
      };
    case GET_COUNT:
      return {
        ...state,
        stateTickets: {
          newTickets: action.stateTickets.newTickets,
          openTickets: action.stateTickets.openTickets,
          resolvedTickets: action.stateTickets.resolvedTickets,
          assignedTickets: action.stateTickets.assignedTickets,
        },
      };
    case GET_POSTS:
      return {
        ...state,
        ticket: null,
        loading: false,
        tickets: payload,
        error: null,
      };
    case GET_POST:
      return {
        ...state,
        ticket: payload,
        loading: false,
        tickets: [],
        error: null,
      };
    case ADD_POST:
      return {
        ...state,
        ticket: payload,
        loading: false,
        tickets: payload,
        error: null,
      };
    default:
      return state;
  }
}
