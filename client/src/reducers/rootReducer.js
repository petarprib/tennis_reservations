import { combineReducers } from "redux";
import homepageReducer from "./homepageReducer";

const rootReducer = combineReducers({
  clientsTab: homepageReducer,
});

export default rootReducer;
