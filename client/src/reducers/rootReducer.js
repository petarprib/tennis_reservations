import { combineReducers } from "redux";
import clubAuthReducer from "./clubAuthReducer";

const rootReducer = combineReducers({
  clubAuth: clubAuthReducer,
});

export default rootReducer;
