const initialState = [];

const courtsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_COURTS":
      return payload.courts;
    default:
      return state;
  }
};

export default courtsReducer;
