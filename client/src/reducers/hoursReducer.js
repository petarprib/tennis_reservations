const initialState = [];

const hoursReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_HOURS":
      return payload.hours;
    default:
      return state;
  }
};

export default hoursReducer;
