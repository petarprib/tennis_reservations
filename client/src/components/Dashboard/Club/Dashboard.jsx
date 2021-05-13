import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../Dashboard/dashboard.access.scss";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.jsx";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
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
  const [allLoaded, setAllLoaded] = useState(0);
  // const classes = useStyles();
  const [splitHour, setSplitHour] = useState(2);
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
  const [reservations, setReservations] = useState([
    {
      id: "dab6be12-da9d-4e0f-89ed-6a31e0f3455f",
      club: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      court: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      player: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      start_time: "2021-05-11 18:00:00",
      end_time: "2021-05-11 19:30:00",
    },
    {
      id: "ed90f906-ae29-44d3-b20d-020ef5497485",
      club: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      court: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      player: "f5d90000-88c3-414e-960e-d37b26fc96a8",
      start_time: "2021-05-11 20:30:00",
      end_time: "2021-05-11 21:30:00",
    },
  ]);

  useEffect(() => {
    getAccountInfo();
    getCourts();
    getCourtTypes();
    getDate();
    getHours();
  }, []);

  const getHours = () => {
    let allSessions = [];
    let hour = openTime;
    while (hour.isBefore(closeTime)) {
      allSessions.push(hour.format("HH:mm"));
      if (splitHour === 1) {
        hour = moment(hour).add(1, "hours");
      } else if (splitHour === 2) {
        hour = moment(hour).add(30, "minutes");
      }
    }
    setHours(allSessions);
  };

  const getDate = async () => {
    setDay(new moment());
    // console.log(new moment());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDay(moment(date));
  };

  const getCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    setCourts([...parseRes]);
  };

  const getAccountInfo = async () => {
    try {
      const res = await fetch("/api/dashboard/clubs");
      const parseRes = await res.json();
      setType(parseRes.type);
      setName(parseRes.name);
      setAllLoaded((prevState) => prevState + 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getCourtTypes = async () => {
    try {
      const res = await fetch("/api/dashboard/court-types");
      const parseRes = await res.json();
      // setCourtTypes([{ id: 0, type: "All" }, ...parseRes]);
      setCourtTypes([...parseRes]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logOut = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/logout");
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: parseRes === true ? true : false,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = { courtType, courtNumber };
      const res = await fetch("/api/dashboard/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      if (typeof parseRes !== "string") {
        getCourts();
        setCourtError("");
      } else {
        setCourtError(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  if (allLoaded !== 1) {
    return <LoadingScreen />;
  } else {
    return (
      <div>
        Dashboard
        <h1>
          Hello {type === 2 ? "club" : "player"} {name}
        </h1>
        <button onClick={(event) => logOut(event)}>Logout</button>
        <form onSubmit={(event) => handleSubmit(event)}>
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
                  let color;
                  reservations.every((reservation) => {
                    let now = moment(hour, "HH:mm")
                      .days(day.days())
                      .month(day.month())
                      .year(day.year());
                    let start = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
                    let end = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
                    if (now.isBetween(start, end) || now.isSame(start)) {
                      color = "lightblue";
                      return false;
                    }
                    color = "yellow";
                    return true;
                  });

                  return (
                    <div className="hour" style={{ backgroundColor: color }} key={hour} data-dashboard>
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

// {hours.map(hour => {
//   reservations.map(reservation => if(moment(hour, "HH:mm").isBetween(moment(reservation.startDate), moment(reservation.endDate))))
// })}

export default Dashboard;
