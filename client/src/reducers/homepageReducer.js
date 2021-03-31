const initialState = true;

const homepageReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_TAB":
      return payload;
    default:
      return state;
  }

  // return state;
};

export default homepageReducer;
