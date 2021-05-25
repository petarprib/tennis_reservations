import React from "react";
import AddCourt from "./AddCourt.jsx";
import ManageHours from "./ManageHours.jsx";
import Schedule from "../Schedule.jsx";
import ConfigOpenHoursModal from "./ConfigOpenHoursModal.jsx";

const ClubDashboard = () => {
  return (
    <div id="dashboard" data-dashboard>
      <ConfigOpenHoursModal />
      <div id="club-dashboard-options-wrapper" data-dashboard>
        <AddCourt />
        <ManageHours />
      </div>
      <Schedule />
    </div>
  );
};

export default ClubDashboard;
