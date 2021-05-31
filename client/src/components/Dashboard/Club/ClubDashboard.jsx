import React from "react";
import Options from "../Options.jsx";
import Schedule from "../Schedule.jsx";
import ConfigOpenHoursModal from "./ConfigOpenHoursModal.jsx";

const ClubDashboard = () => {
  return (
    <div id="dashboard" data-dashboard>
      <ConfigOpenHoursModal />
      <Options />
      <Schedule />
    </div>
  );
};

export default ClubDashboard;
