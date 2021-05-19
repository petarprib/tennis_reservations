const initialState = "";

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER":
      return payload.user;
    default:
      return state;
  }
};

export default userReducer;
