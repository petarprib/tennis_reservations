const initialState = new Date();

const selectedDateReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_SELECTED_DATE":
      return payload.selectedDate;
    default:
      return state;
  }
};

export default selectedDateReducer;
