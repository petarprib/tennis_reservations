import React from "react";
import AddCourt from "./Club/AddCourt.jsx";
import ManageHours from "./Club/ManageHours.jsx";

const Options = () => {
  return (
    <div id="club-dashboard-options-wrapper" data-dashboard>
      <ManageHours />
      <AddCourt />
    </div>
  );
};

export default Options;
