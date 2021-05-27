import moment from "moment";

const initialState = moment();

const closeTimeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_CLOSE_TIME":
      return payload.closeTime;
    default:
      return state;
  }
};

export default closeTimeReducer;
