const initialState = "loading";

const userTypeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER_TYPE":
      return payload.userType;
    default:
      return state;
  }
};

export default userTypeReducer;
