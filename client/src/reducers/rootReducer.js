import { combineReducers } from "redux";
import authReducer from "./authReducer";
import closeTimeReducer from "./closeTimeReducer";
import courtsReducer from "./courtsReducer";
import courtTypeReducer from "./courtTypeReducer";
import courtTypesReducer from "./courtTypesReducer";
import dateReducer from "./dateReducer";
import filteredCourtsReducer from "./filteredCourtsReducer";
import filteredCourtTypesReducer from "./filteredCourtTypesReducer";
import openTimeReducer from "./openTimeReducer";
import reservationsReducer from "./reservationsReducer";
import hoursReducer from "./hoursReducer";
import selectedDateReducer from "./selectedDateReducer";
import userDataReducer from "./userDataReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  closeTime: closeTimeReducer,
  courts: courtsReducer,
  courtType: courtTypeReducer,
  courtTypes: courtTypesReducer,
  date: dateReducer,
  filteredCourts: filteredCourtsReducer,
  filteredCourtTypes: filteredCourtTypesReducer,
  openTime: openTimeReducer,
  reservations: reservationsReducer,
  hours: hoursReducer,
  selectedDate: selectedDateReducer,
  userData: userDataReducer,
});

export default rootReducer;
