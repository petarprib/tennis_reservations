const initialState = [];

const courtTypesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_COURT_TYPES":
      return payload.courtTypes;
    default:
      return state;
  }
};

export default courtTypesReducer;
