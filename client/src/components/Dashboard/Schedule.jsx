import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ScrollContainer from "react-indiana-drag-scroll";
import fetchHours from "../../utils/fetchHours";
import fetchReservations from "../../utils/fetchReservations";
import reserveTimeFn from "../../utils/reserveTimeFn";
import deleteCourtFn from "../../utils/deleteCourtFn";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import EditCourtModal from "./EditCourtModal.jsx";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#fff",
    color: "#000",
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    fontSize: "14px",
    border: "1px solid #000",
  },
}))(Tooltip);

const Schedule = () => {
  const dispatch = useDispatch();
  const schedule = useRef(null);
  const closeTime = useSelector((state) => state.closeTime);
  const openTime = useSelector((state) => state.openTime);
  const courts = useSelector((state) => state.courts);
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);
  const [date, setDate] = useState(moment());
  const [filteredCourts, setfilteredCourts] = useState([]);
  const [filteredCourtTypes, setFilteredCourtTypes] = useState([]);
  const [hours, setHours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useSelector((state) => state.user);
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    getCourts();
    getCurrentDate();
    getOpenCloseTimes();
    getReservations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getUpdatedCourts();
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
    getHours();
    // eslint-disable-next-line
  }, [openTime, closeTime]);

  const getCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
    setfilteredCourts(parseRes);
  };

  const getCurrentDate = async () => {
    setDate(moment(date));
  };

  const getOpenCloseTimes = async () => {
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
  const getHours = async () => {
    const hours = await fetchHours(openTime, closeTime);
    setHours(hours);
  };

  const getReservations = async () => {
    const reservations = await fetchReservations();
    setReservations(reservations);
  };

  // Live update of court list after adding, deleting or editing a court
  const getUpdatedCourts = async () => {
    setfilteredCourts(courts);
    setCourtType(0);
  };

  // Filters courts based on selected surface type
  const filterCourts = () => {
    if (courtType === 0) return setfilteredCourts(courts);
    const courtsFilter = courts.filter((court) => court.type_id === courtType);
    setfilteredCourts(courtsFilter);
  };

  // Filters court types based on surface types available at the club
  const filterCourtTypes = () => {
    let courtTypesFilter = [];

    for (let i = 0; i < courtTypes.length; i++) {
      for (let j = 0; j < courts.length; j++) {
        if (courtTypes[i].id === courts[j].type_id) {
          courtTypesFilter.push(courtTypes[i]);
          break;
        }
      }
    }

    setFilteredCourtTypes([{ id: 0, type: "All" }, ...courtTypesFilter]);
  };

  const reserveTime = async (time, club, court) => {
    await reserveTimeFn(time, club, court, date);
    getReservations();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDate(moment(date));
  };

  const deleteCourt = async (court) => {
    await deleteCourtFn(court);
    getCourts();
  };

  return (
    <div>
      <div id="schedule-filter" data-dashboard>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              inputVariant="outlined"
              size="small"
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={(date) => handleDateChange(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div>
          <FormControl
            variant="outlined"
            size="small"
            // className={classes.formControl}
          >
            <InputLabel id="court-type-input">Court type</InputLabel>
            <Select
              labelId="court-type-select-label"
              id="court-type-select"
              value={courtType}
              onChange={(event) => setCourtType(event.target.value)}
              label="Court type"
            >
              {filteredCourtTypes.map((courtType) => (
                <MenuItem key={courtType.id} value={courtType.id}>
                  {courtType.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div id="color-guide" data-dashboard>
        <div>
          <p>Available</p>
          <i className="fas fa-square-full yellowgreen" data-dashboard />
        </div>
        <div>
          <p>Unavailable</p>
          <i className="fas fa-square-full red" data-dashboard />
        </div>
        <div>
          <p>You</p>
          <i className="fas fa-square-full skyblue" data-dashboard />
        </div>
      </div>

      <ScrollContainer id="schedule" innerRef={schedule} hideScrollbars={false} data-dashboard>
        {filteredCourts.map((court) => (
          <div key={court.number}>
            <div className="court-info" data-dashboard>
              <p>Court {court.number}</p>
              <p>|</p>
              <p>{court.type}</p>
              {userType === 2 && <p>|</p>}
              {userType === 2 && (
                <EditCourtModal courtId={court.id} courtNumber={court.number} courtType={court.type_id} />
              )}
              {userType === 2 && <p>|</p>}
              {userType === 2 && (
                <p className="court-edit-option delete-court" onClick={() => deleteCourt(court.id)}>
                  Delete
                </p>
              )}
            </div>
            <div className="hours" data-dashboard>
              {hours.map((hour) => {
                let playerReservation = false;
                let color = "rgb(154, 205, 50)";
                let nameAcronym;
                let name;
                let email;
                reservations.map((reservation) => {
                  // console.log(reservation);
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
                      color = "rgb(255, 0, 0)";
                      nameAcronym = reservation.name.match(/\b(\w)/g).join("");
                      name = reservation.name;
                      email = reservation.email;
                    }
                    return false;
                  }
                  return true;
                });

                let basicView = (
                  <div
                    key={hour}
                    className="hour"
                    style={{ backgroundColor: color }}
                    onClick={() => reserveTime(hour, court.club, court.id)}
                    data-dashboard
                  >
                    <p>{hour}</p>
                    <p>{userType === 2 && nameAcronym}</p>
                  </div>
                );

                let clubView = (
                  <HtmlTooltip
                    key={hour}
                    title={
                      <>
                        <p>{name}</p>
                        <p>{email}</p>
                      </>
                    }
                  >
                    {basicView}
                  </HtmlTooltip>
                );

                return playerReservation && userType === 2 ? clubView : basicView;
              })}
            </div>
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
};

export default Schedule;
