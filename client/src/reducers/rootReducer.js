import { combineReducers } from "redux";
import authReducer from "./authReducer";
import closeTimeReducer from "./closeTimeReducer";
import clubReducer from "./clubReducer";
import courtsReducer from "./courtsReducer";
import courtTypesReducer from "./courtTypesReducer";
import openTimeReducer from "./openTimeReducer";
import userReducer from "./userReducer";
import userNameReducer from "./userNameReducer";
import userTypeReducer from "./userTypeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  closeTime: closeTimeReducer,
  club: clubReducer,
  courts: courtsReducer,
  courtTypes: courtTypesReducer,
  openTime: openTimeReducer,
  user: userReducer,
  userName: userNameReducer,
  userType: userTypeReducer,
});

export default rootReducer;
