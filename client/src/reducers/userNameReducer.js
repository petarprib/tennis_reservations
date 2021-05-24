const initialState = "";

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER_NAME":
      return payload.userName;
    default:
      return state;
  }
};

export default userReducer;
