import { combineReducers } from "redux";
import authReducer from "./authReducer";
import clubReducer from "./clubReducer";
import courtsReducer from "./courtsReducer";
import courtTypesReducer from "./courtTypesReducer";
import dateReducer from "./dateReducer";
import hoursReducer from "./hoursReducer";
import reservationsReducer from "./reservationsReducer";
import userReducer from "./userReducer";
import userTypeReducer from "./userTypeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  club: clubReducer,
  courts: courtsReducer,
  courtTypes: courtTypesReducer,
  date: dateReducer,
  hours: hoursReducer,
  reservations: reservationsReducer,
  user: userReducer,
  userType: userTypeReducer,
});

export default rootReducer;
