const initialState = [];

const courtsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_COURTS":
      return payload.courts;
    case "EDIT_COURTS":
      const index = state.findIndex((court) => court.id === payload.id);
      const newCourts = [...state];
      newCourts[index].number = payload.number;
      newCourts[index].type_id = payload.type;
      return newCourts;
    default:
      return state;
  }
};

export default courtsReducer;
