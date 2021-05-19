const initialState = "loading";

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_AUTH":
      return payload.auth;
    default:
      return state;
  }
};

export default authReducer;
