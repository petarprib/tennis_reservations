import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../Dashboard/dashboard.access.scss";
import fetchHourList from "../../../utils/fetchHourList";
import addCourtFn from "../../../utils/addCourtFn";
import fetchCourtTypeList from "../../../utils/fetchCourtTypeList";
import logOutFn from "../../../utils/logOutFn";
import fetchReservationList from "../../../utils/fetchReservationList";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.jsx";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import moment from "moment";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

const Dashboard = () => {
  const dispatch = useDispatch();
  const [day, setDay] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState();
  const [courtTypes, setCourtTypes] = useState([]);
  const [courtType, setCourtType] = useState("");
  const [courtNumber, setCourtNumber] = useState(0);
  const [courts, setCourts] = useState([]);
  const [courtError, setCourtError] = useState("");
  const [allLoaded, setAllLoaded] = useState(false);
  // const classes = useStyles();
  const [minOneHour, setMinOneHour] = useState();
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
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [hours, setHours] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getAccountInfo();
    getCourts();
    fetchCourtTypes();
    getDate();
    fetchReservations();
  }, []);

  useEffect(() => {
    fetchHours();
  }, [minOneHour]);

  const fetchReservations = async () => {
    const reservationList = await fetchReservationList();
    setReservations(reservationList);
  };

  const fetchHours = async () => {
    const hourList = await fetchHourList(openTime, closeTime);
    setHours(hourList);
  };

  const getDate = async () => {
    setDay(new moment());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDay(moment(date));
  };

  const getCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    setCourts(parseRes);
  };

  const getAccountInfo = async () => {
    try {
      const res = await fetch("/api/dashboard/clubs");
      const parseRes = await res.json();
      setType(parseRes.type);
      setName(parseRes.name);
      // setOpenTime(parseRes.open_time);
      // setCloseTime(parseRes.close_time);
      setMinOneHour(parseRes.min_one_hour);
      setAllLoaded(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCourtTypes = async () => {
    const courtTypeList = await fetchCourtTypeList();
    setCourtTypes(courtTypeList);
  };

  const logOut = async () => {
    const loggedOut = logOutFn();
    dispatch({
      type: "CHANGE_CLUBAUTH",
      payload: {
        clubAuth: loggedOut === true ? true : false,
      },
    });
    return;
  };

  const addCourt = async (event) => {
    event.preventDefault();
    const parseRes = await addCourtFn(courtType, courtNumber);
    if (typeof parseRes !== "string") {
      getCourts();
      setCourtError("");
    } else {
      setCourtError(parseRes);
    }
  };

  // you create/"declare" a moment with moment(variable/string, "the format of the variable/string") - the format is in order for moment to recognize what you're giving it
  // if you want to assign it a specific time or date (usually it's what you have NOT provided inside the "moment()"), you do for example:
  // moment(hour, "HH:mm")
  //   .days(day.days())
  // the first ".days()" is in order to tell it what you're assigning, the "day" is a moment object which has an entire date string and is the variable of a date where you're getting the day from, the second ".days()" inside () is where you are getting the day from the date string
  // you continue doing the same with month, year, hour, minute or second
  // if you want to display it as a string you do variable.format("format") - the format can be anything, since it has everything assigned, whether automatically, or manually by specifying the dates/times

  const reserveTime = async (time, club, court) => {
    try {
      let chosenTime = moment(time, "HH:mm")
        .days(day.days())
        .month(day.month())
        .year(day.year());
      let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");
      let endTime = chosenTime.add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

      const body = { club, court, startTime, endTime }; // player is the one in the session
      const res = await fetch("/api/dashboard/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // const parseRes = await res.json();
      // console.log(parseRes);
      // setReservations([
      //   ...reservations,
      //   {
      //     ...parseRes,
      //     start_time: moment(parseRes.start_time).format("YYYY-MM-DD HH:mm:ss"),
      //     end_time: moment(parseRes.end_time).format("YYYY-MM-DD HH:mm:ss"),
      //   },
      // ]);

      fetchReservations();

      // if (typeof parseRes !== "string") {
      //   getCourts();
      //   setCourtError("");
      // } else {
      //   setCourtError(parseRes);
      // }
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!allLoaded) {
    return <LoadingScreen />;
  } else {
    return (
      <div>
        Dashboard
        <h1>
          Hello {type === 2 ? "club" : "player"} {name}
        </h1>
        <button onClick={() => logOut()}>Logout</button>
        <form onSubmit={(event) => addCourt(event)}>
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
              {courtTypes.map((courtType) => (
                <MenuItem key={courtType.id} value={courtType.id}>
                  {courtType.type}
                </MenuItem>
              ))}
            </Select>
            <TextField
              id="court-name"
              label="Court number"
              variant="outlined"
              autoComplete="off"
              onChange={(event) => setCourtNumber(event.target.value)}
              size="small"
            />
            <Button type="submit" variant="contained" color="primary">
              Add court
            </Button>
            <p>{courtError}</p>
          </FormControl>
        </form>
        <Switch
          checked={minOneHour}
          onChange={() => setMinOneHour(!minOneHour)}
          color="primary"
          name="checkedB"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <p>Minimum one hour rental</p>
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
        <div>
          {courts.map((court) => (
            <div key={court.number}>
              <p>
                {court.number} | {court.type}
              </p>
              <div className="hours" data-dashboard>
                {hours.map((hour) => {
                  let color = "lightblue";
                  reservations.map((reservation) => {
                    if (court.id !== reservation.court) return false;
                    let now = moment(hour, "HH:mm")
                      .days(day.days())
                      .month(day.month())
                      .year(day.year());
                    let start = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
                    let end = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
                    if (now.isSame(start) || now.isBetween(start, end)) {
                      color = "orange";
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
                      {hour}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Dashboard;
