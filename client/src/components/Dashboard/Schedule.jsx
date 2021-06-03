import React, { useState, useEffect, useRef, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import fetchHoursUtil from "../../utils/fetchHoursUtil";
import fetchReservationsUtil from "../../utils/fetchReservationsUtil";
import reserveTimeUtil from "../../utils/reserveTimeUtil";
import deleteCourtUtil from "../../utils/deleteCourtUtil";
import "date-fns";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import EditCourtModal from "./modals/EditCourtModal.jsx";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#fff",
    color: "#000",
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    fontSize: "14px",
    border: "1px solid #000",
    margin: "0 0 5px 0",
  },
}))(Tooltip);

const Schedule = () => {
  const dispatch = useDispatch();
  const hoursIndex = useRef();
  const closeTime = useSelector((state) => state.closeTime);
  const openTime = useSelector((state) => state.openTime);
  const courts = useSelector((state) => state.courts);
  const courtType = useSelector((state) => state.courtType);
  const courtTypes = useSelector((state) => state.courtTypes);
  const date = useSelector((state) => state.date);
  const [filteredCourts, setfilteredCourts] = useState([]);
  const [hours, setHours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const user = useSelector((state) => state.user);
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    fetchCourts();
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

  const fetchCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
    setfilteredCourts(parseRes);
  };

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
    setHours(hours);
  };

  const fetchReservations = async () => {
    const reservations = await fetchReservationsUtil();
    setReservations(reservations);
  };

  // Live update of court list after adding, deleting or editing a court
  const fetchUpdatedCourts = async () => {
    setfilteredCourts(courts);
    dispatch({
      type: "SET_COURT_TYPE",
      payload: { courtType: 0 },
    });
  };

  // Filters courts based on selected surface type
  const filterCourts = () => {
    if (courtType === 0) return setfilteredCourts(courts);
    const courtsFilter = courts.filter((court) => court.type_id === courtType);
    setfilteredCourts(courtsFilter);
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

  const reserveTime = async (time, club, court) => {
    await reserveTimeUtil(time, club, court, date);
    fetchReservations();
  };

  const deleteCourt = async (court) => {
    await deleteCourtUtil(court);
    fetchCourts();
  };

  let courtRefs = [];

  const handleScroll = (e) => {
    let currentPosition = e.target.scrollLeft;
    hoursIndex.current.scrollLeft = currentPosition;
    for (let ref of courtRefs) {
      ref.current.scrollLeft = currentPosition;
    }
  };

  return (
    <div>
      {filteredCourts.length > 0 && (
        <>
          <div id="color-guide" data-dashboard>
            <div>
              <p>Available</p>
              <i className="fas fa-square-full available" data-dashboard />
            </div>
            <div>
              <p>Unavailable</p>
              <i className="fas fa-square-full unavailable" data-dashboard />
            </div>
            <div>
              <p>You</p>
              <i className="fas fa-square-full you" data-dashboard />
            </div>
          </div>

          <div id="schedule" data-dashboard>
            <div id="hours-index" onScroll={(e) => handleScroll(e)} ref={hoursIndex} data-dashboard>
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

            {filteredCourts.map((court) => {
              const newRef = createRef();
              courtRefs.push(newRef);
              return (
                <div className="court" key={court.number} data-dashboard>
                  <div className="court-info" data-dashboard>
                    <p className="court-number" data-dashboard>
                      {court.number}
                    </p>
                    <p className="court-type" data-dashboard>
                      {court.type}
                    </p>
                    {userType === 2 && (
                      <EditCourtModal courtId={court.id} courtNumber={court.number} courtType={court.type_id} />
                    )}
                    {userType === 2 && <i className="fas fa-trash" onClick={() => deleteCourt(court.id)} />}
                  </div>

                  <div className="hours" onScroll={(e) => handleScroll(e)} ref={newRef} data-dashboard>
                    {hours.map((hour) => {
                      let playerReservation = false;
                      let color = "rgb(154, 205, 50)";
                      let nameAcronym;
                      let name;
                      let email;
                      reservations.map((reservation) => {
                        if (court.id !== reservation.court) return false;
                        let now = moment(hour, "HH:mm")
                          .date(date.date())
                          .month(date.month())
                          .year(date.year());
                        let startTime = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
                        let endTime = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
                        if (now.isSame(startTime) || now.isBetween(startTime, endTime)) {
                          if (reservation.player === user) {
                            color = "rgb(135, 206, 235)";
                          } else {
                            playerReservation = true;
                            color = "rgb(255, 70, 53)";
                            nameAcronym = reservation.name.match(/\b(\w)/g).join("");
                            name = reservation.name;
                            email = reservation.email;
                          }
                          return false;
                        }
                        return true;
                      });

                      let basicHour = (
                        <div
                          key={hour}
                          className="hour"
                          style={{ backgroundColor: color }}
                          onClick={() => reserveTime(hour, court.club, court.id)}
                          data-dashboard
                        >
                          {userType === 2 && <p>{nameAcronym}</p>}
                        </div>
                      );

                      let tooltipHour = (
                        <HtmlTooltip
                          key={hour}
                          placement="top"
                          title={
                            <>
                              <p>{name}</p>
                              <p>{email}</p>
                            </>
                          }
                        >
                          {basicHour}
                        </HtmlTooltip>
                      );

                      return playerReservation && userType === 2 ? tooltipHour : basicHour;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
