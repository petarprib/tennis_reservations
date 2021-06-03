import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ScheduleFilter from "./ScheduleFilter.jsx";

import MenuOptions from "./MenuOptions/MenuOptions.jsx";

const Sections = () => {
  const section = useSelector((state) => state.section);
  const [secondSection, setSecondSection] = useState();

  useEffect(() => {
    setSecondSection(section);
  }, [section]);

  return (
    <div id="sections" data-dashboard>
      <div id="schedule-filter" data-dashboard>
        <ScheduleFilter />
      </div>
      <div id="options" data-dashboard>
        <MenuOptions />
        {secondSection}
      </div>
    </div>
  );
};

export default Sections;
