import React from "react";
import AddCourt from "./AddCourt.jsx";
import ManageHours from "./ManageHours.jsx";
import Schedule from "../Schedule.jsx";

const NewClubDashboard = () => {
  return (
    <div id="dashboard" data-dashboard>
      <div id="club-dashboard-options-wrapper" data-dashboard>
        <AddCourt />
        <ManageHours />
      </div>
      <Schedule />
    </div>
  );
};

export default NewClubDashboard;
