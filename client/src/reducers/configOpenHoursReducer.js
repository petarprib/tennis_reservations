const initialState = true;

const configOpenHoursReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_CONFIG_OPEN_HOURS":
      return payload.configOpenHours;
    default:
      return state;
  }
};

export default configOpenHoursReducer;
