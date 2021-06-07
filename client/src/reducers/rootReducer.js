import { combineReducers } from "redux";
import authReducer from "./authReducer";
import closeTimeReducer from "./closeTimeReducer";
import clubReducer from "./clubReducer";
import courtsReducer from "./courtsReducer";
import courtTypeReducer from "./courtTypeReducer";
import courtTypesReducer from "./courtTypesReducer";
import dateReducer from "./dateReducer";
import filteredCourtTypesReducer from "./filteredCourtTypesReducer";
import openTimeReducer from "./openTimeReducer";
import reservationsReducer from "./reservationsReducer";
import hoursReducer from "./hoursReducer";
import selectedDateReducer from "./selectedDateReducer";
import userNameReducer from "./userNameReducer";
import userReducer from "./userReducer";
import userTypeReducer from "./userTypeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  closeTime: closeTimeReducer,
  club: clubReducer,
  courts: courtsReducer,
  courtType: courtTypeReducer,
  courtTypes: courtTypesReducer,
  date: dateReducer,
  filteredCourtTypes: filteredCourtTypesReducer,
  openTime: openTimeReducer,
  reservations: reservationsReducer,
  hours: hoursReducer,
  selectedDate: selectedDateReducer,
  userName: userNameReducer,
  user: userReducer,
  userType: userTypeReducer,
});

export default rootReducer;
