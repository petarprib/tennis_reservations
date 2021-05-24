import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ScrollContainer from "react-indiana-drag-scroll";
import fetchHours from "../../utils/fetchHours";
import fetchReservations from "../../utils/fetchReservations";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

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
  const [filteredCourtTypes, setFilteredCourtTypes] = useState([{ id: 0, type: "All" }]);
  const hours = useSelector((state) => state.hours);
  const reservations = useSelector((state) => state.reservations);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getCourts();
    getCurrentDate();
    getHours();
    getReservations();
    // eslint-disable-next-line
  }, []);

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
    const hourList = await fetchHours(openTime, closeTime);
    dispatch({
      type: "SET_HOURS",
      payload: { hours: hourList },
    });
  };

  const getReservations = async () => {
    const reservationList = await fetchReservations();
    dispatch({
      type: "SET_RESERVATIONS",
      payload: { reservations: reservationList },
    });
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

    setFilteredCourtTypes([...filteredCourtTypes, ...courtTypesFilter]);
  };

  const reserveTime = async (time, club, court) => {
    try {
      let chosenTime = moment(time, "HH:mm")
        .date(date.date())
        .month(date.month())
        .year(date.year());
      let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");
      let endTime = chosenTime.add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

      const body = { club, court, startTime, endTime };
      // eslint-disable-next-line
      const res = await fetch("/api/dashboard/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getReservations();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    dispatch({
      type: "SET_DATE",
      payload: { date: moment(date) },
    });
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
            <p className="court-info" data-dashboard>
              Court {court.number} | {court.type}
            </p>
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
