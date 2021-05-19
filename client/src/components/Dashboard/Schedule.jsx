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

const Schedule = () => {
  const schedule = useRef(null);
  const dispatch = useDispatch();
  const courts = useSelector((state) => state.courts);
  const hours = useSelector((state) => state.hours);
  const reservations = useSelector((state) => state.reservations);
  const user = useSelector((state) => state.user);
  const date = useSelector((state) => state.date);
  const [openTime, setOpenTime] = useState(
    moment()
      .second(0)
      .minute(0)
      .hour(8)
  );
  const [closeTime, setCloseTime] = useState(
    moment()
      .second(0)
      .minute(0)
      .hour(22)
  );
  // const [day, setDay] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useEffect(() => {
    getCourts();
    getHours();
    getReservations();
    getDate();
    // eslint-disable-next-line
  }, []);

  const getCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
  };

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

  const getDate = async () => {
    dispatch({
      type: "SET_DATE",
      payload: { date: moment() },
    });
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
    // setDay(moment(date));
    dispatch({
      type: "SET_DATE",
      payload: { date: moment(date) },
    });
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
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
        </Grid>
      </MuiPickersUtilsProvider>
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
        {courts.map((court) => (
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
