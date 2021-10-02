import { tickets } from "../actions/ticket";
import { GET_POSTS, GET_POST, ADD_POST } from "../actions/types";

const initialState = {
  ticket: null,
  tickets: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
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
        tickets: [],
        error: null,
      };
    default:
      return state;
  }
}
