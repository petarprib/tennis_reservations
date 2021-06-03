import ChangeName from "../components/Dashboard/MenuOptions/ChangeName.jsx";

const initialState = <ChangeName />;

const changeSection = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_SECTION":
      return payload.section;
    default:
      return state;
  }
};

export default changeSection;
