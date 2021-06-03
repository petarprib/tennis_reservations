const initialState = "";

const courtTypeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_COURT_TYPE":
      return payload.courtType;
    default:
      return state;
  }
};

export default courtTypeReducer;
