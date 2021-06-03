import moment from "moment";

const initialState = moment();

const dateReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_DATE":
      return payload.date;
    default:
      return state;
  }
};

export default dateReducer;
