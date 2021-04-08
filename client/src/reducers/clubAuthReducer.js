const initialState = false;

const clubAuthReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_CLUBAUTH":
      return payload.clubAuth;
    default:
      return state;
  }

  // return state;
};

export default clubAuthReducer;
