import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ScrollContainer from "react-indiana-drag-scroll";
import fetchHours from "../../utils/fetchHours";
import fetchReservations from "../../utils/fetchReservations";
import reserveTimeFn from "../../utils/reserveTimeFn";
import deleteCourtFn from "../../utils/deleteCourtFn";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import EditCourtModal from "./EditCourtModal.jsx";

const Schedule = () => {
  const dispatch = useDispatch();
  const schedule = useRef(null);
  const [closeTime, setCloseTime] = useState(
    moment()
      .second(0)
      .minute(0)
      .hour(22)
  );
  const [openTime, setOpenTime] = useState(
    moment()
      .second(0)
      .minute(0)
      .hour(8)
  );
  const courts = useSelector((state) => state.courts);
  const [courtType, setCourtType] = useState(0);
  const courtTypes = useSelector((state) => state.courtTypes);
  const date = useSelector((state) => state.date);
  const [filteredCourts, setfilteredCourts] = useState([]);
  const [filteredCourtTypes, setFilteredCourtTypes] = useState([]);
  const hours = useSelector((state) => state.hours);
  const reservations = useSelector((state) => state.reservations);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const user = useSelector((state) => state.user);
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    getCourts();
    getCurrentDate();
    getHours();
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
    dispatch({
      type: "SET_DATE",
      payload: { date: moment() },
    });
  };

  // Fetches opening and closing hours
  const getHours = async () => {
    const hours = await fetchHours(openTime, closeTime);
    dispatch({
      type: "SET_HOURS",
      payload: { hours },
    });
  };

  const getReservations = async () => {
    const reservations = await fetchReservations();
    dispatch({
      type: "SET_RESERVATIONS",
      payload: { reservations },
    });
  };

  //DA LI MIJENJAT UPORNO STATE AKO IMAM USEEFFECT KOJI FETCHA COURTS SVAKI PUT? JE LI TOLIKO BITNO DA SE DB CALLS IZBJEGAVAJU?
  // FOR EVERY ADDED COURT (AND OTHER THINGS) IT ADDS A DUPLICATE OF THE ORIGINAL COURT TYPE LIST

  // Live update of court list after adding, deleting or editing a court
  const getUpdatedCourts = async () => {
    setfilteredCourts(courts);
    setCourtType(0);
  };

  // Filters courts based on selected surface type
  const filterCourts = () => {
    if (courtType === 0) return setfilteredCourts(courts);
    let courtsFilter = courts.filter((court) => court.type_id === courtType);
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
    dispatch({
      type: "SET_DATE",
      payload: { date: moment(date) },
    });
  };

  const deleteCourt = async (court) => {
    await deleteCourtFn(court);
    getCourts();
  };

  //   // you create/"declare" a moment with moment(variable/string, "the format of the variable/string") - the format is in order for moment to recognize what you're giving it
  //   // if you want to assign it a specific time or date (usually it's what you have NOT provided inside the "moment()"), you do for example:
  //   // moment(hour, "HH:mm")
  //   //   .date(day.date())
  //   // the first ".date()" is in order to tell it what you're assigning, the "day" is a moment object which has an entire date string and is the variable of a date where you're getting the day from, the second ".date()" inside () is where you are getting the day from the date string
  //   // you continue doing the same with month, year, hour, minute or second
  //   // if you want to display it as a string you do variable.format("format") - the format can be anything, since it has everything assigned, whether automatically, or manually by specifying the dates/times

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
                let color = "rgb(154, 205, 50)";
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
                      color = "rgb(255, 0, 0)";
                    }
                    return false;
                  }
                  return true;
                });

                return (
                  <div
                    className="hour"
                    style={{ backgroundColor: color }}
                    key={hour}
                    onClick={() => reserveTime(hour, court.club, court.id)}
                    data-dashboard
                  >
                    <p>{hour}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
};

export default Schedule;
