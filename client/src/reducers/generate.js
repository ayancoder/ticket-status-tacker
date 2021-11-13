import { REPORT_FETCH_FAIL, REPORT_FETCH_SUCCESS } from "../actions/types";

const initialState = {
  filename: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REPORT_FETCH_SUCCESS:
      return {
        ...state,
        filename: payload,
      };
    case REPORT_FETCH_FAIL:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}
