const initialState = [];

const filteredCourtsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_FILTERED_COURTS":
      return payload.filteredCourts;
    default:
      return state;
  }
};

export default filteredCourtsReducer;
