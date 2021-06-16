import React, { useEffect, useRef, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import fetchHoursUtil from "../../../utils/fetchHoursUtil";
import fetchReservationsUtil from "../../../utils/fetchReservationsUtil";
import "date-fns";
import Court from "./Court.jsx";

const Schedule = () => {
  const dispatch = useDispatch();
  const hoursIndex = useRef();
  const closeTime = useSelector((state) => state.closeTime);
  const openTime = useSelector((state) => state.openTime);
  const courts = useSelector((state) => state.courts);
  const courtType = useSelector((state) => state.courtType);
  const courtTypes = useSelector((state) => state.courtTypes);
  const date = useSelector((state) => state.date);
  const filteredCourts = useSelector((state) => state.filteredCourts);
  const hours = useSelector((state) => state.hours);

  useEffect(() => {
    fetchCurrentDate();
    fetchOpenCloseTimes();
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchUpdatedCourts();
    // eslint-disable-next-line
  }, [courts]);

  useEffect(() => {
    filterCourts();
    // eslint-disable-next-line
  }, [courtType]);

  useEffect(() => {
    filterCourtTypes();
    // eslint-disable-next-line
  }, [courts, courtTypes]);

  useEffect(() => {
    fetchHours();
    // eslint-disable-next-line
  }, [openTime, closeTime]);

  const fetchCurrentDate = async () => {
    dispatch({
      type: "SET_DATE",
      payload: { date: moment(date) },
    });
  };

  const fetchOpenCloseTimes = async () => {
    try {
      const res = await fetch("/api/dashboard/open-hours");
      const parseRes = await res.json();
      dispatch({
        type: "SET_OPEN_TIME",
        payload: { openTime: moment(parseRes.open_time, "HH:mm:ss") },
      });
      dispatch({
        type: "SET_CLOSE_TIME",
        payload: { closeTime: moment(parseRes.close_time, "HH:mm:ss") },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetches opening and closing hours
  const fetchHours = async () => {
    const hours = await fetchHoursUtil(openTime, closeTime);
    dispatch({
      type: "SET_HOURS",
      payload: { hours: hours },
    });
  };

  const fetchReservations = async () => {
    const reservations = await fetchReservationsUtil();
    dispatch({
      type: "SET_RESERVATIONS",
      payload: { reservations: reservations },
    });
  };

  // Live update of court list after adding, deleting or editing a court
  const fetchUpdatedCourts = async () => {
    dispatch({
      type: "SET_FILTERED_COURTS",
      payload: { filteredCourts: courts },
    });
    dispatch({
      type: "SET_COURT_TYPE",
      payload: { courtType: 0 },
    });
  };

  // Filters courts based on selected surface type
  const filterCourts = () => {
    if (courtType === 0)
      return dispatch({
        type: "SET_FILTERED_COURTS",
        payload: { filteredCourts: courts },
      });
    const courtsFilter = courts.filter((court) => court.type_id === courtType);
    dispatch({
      type: "SET_FILTERED_COURTS",
      payload: { filteredCourts: courtsFilter },
    });
  };

  // Filters court types based on surface types available at the club
  const filterCourtTypes = () => {
    let filtered = [];

    for (let i = 0; i < courtTypes.length; i++) {
      for (let j = 0; j < courts.length; j++) {
        if (courtTypes[i].id === courts[j].type_id) {
          filtered.push(courtTypes[i]);
          break;
        }
      }
    }

    dispatch({
      type: "SET_FILTERED_COURT_TYPES",
      payload: { filteredCourtTypes: [{ id: 0, type: "All" }, ...filtered] },
    });
  };

  // when scrolling through the hours of a court, scrolls other courts and hours index simultaneously
  let scrollRefs = [];
  const handleScroll = (event) => {
    let currentPosition = event.target.scrollLeft;
    hoursIndex.current.scrollLeft = currentPosition;
    for (let ref of scrollRefs) {
      ref.current.scrollLeft = currentPosition;
    }
  };

  return (
    <div id="schedule" data-dashboard>
      <div id="hours-index" onScroll={(event) => handleScroll(event)} ref={hoursIndex} data-dashboard>
        {hours.map((hour) => {
          return (
            <div className="hour-index" key={hour} data-dashboard>
              <p>{hour}</p>
            </div>
          );
        })}
      </div>

      <div id="court-info-index" data-dashboard>
        <p>Court #</p>
        <p>Surface type</p>
      </div>

      <div>
        {filteredCourts.map((court) => {
          const scrollRef = createRef();
          scrollRefs.push(scrollRef);
          return (
            <Court key={court.id} court={court} scrollRef={scrollRef} handleScroll={(event) => handleScroll(event)} />
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
