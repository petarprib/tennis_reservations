const initialState = {};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER_DATA":
      console.log(payload.userData);
      return payload.userData;
    default:
      return state;
  }
};

export default authReducer;
