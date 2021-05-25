import { combineReducers } from "redux";
import authReducer from "./authReducer";
import clubReducer from "./clubReducer";
import configOpenHoursReducer from "./configOpenHoursReducer";
import courtsReducer from "./courtsReducer";
import courtTypesReducer from "./courtTypesReducer";
import dateReducer from "./dateReducer";
import hoursReducer from "./hoursReducer";
import reservationsReducer from "./reservationsReducer";
import userReducer from "./userReducer";
import userNameReducer from "./userNameReducer";
import userTypeReducer from "./userTypeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  club: clubReducer,
  configOpenHours: configOpenHoursReducer,
  courts: courtsReducer,
  courtTypes: courtTypesReducer,
  date: dateReducer,
  hours: hoursReducer,
  reservations: reservationsReducer,
  user: userReducer,
  userName: userNameReducer,
  userType: userTypeReducer,
});

export default rootReducer;
