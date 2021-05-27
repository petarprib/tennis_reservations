import moment from "moment";

const initialState = moment();

const openTimeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_OPEN_TIME":
      return payload.openTime;
    default:
      return state;
  }
};

export default openTimeReducer;
