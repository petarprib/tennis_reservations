const initialState = "";

const clubReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_CLUB":
      return payload.club;
    default:
      return state;
  }
};

export default clubReducer;
