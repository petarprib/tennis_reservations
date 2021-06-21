const initialState = { userName: "", user: "", userType: "Loading", club: "" };

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER_DATA":
      return payload.userData;
    default:
      return state;
  }
};

export default authReducer;
