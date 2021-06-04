const initialState = [];

const reservationsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_RESERVATIONS":
      return payload.reservations;
    default:
      return state;
  }
};

export default reservationsReducer;
