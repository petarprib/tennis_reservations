const initialState = [];

const filteredCourtTypesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_FILTERED_COURT_TYPES":
      return payload.filteredCourtTypes;
    default:
      return state;
  }
};

export default filteredCourtTypesReducer;
