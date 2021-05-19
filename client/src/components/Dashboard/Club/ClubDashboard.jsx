// import React, { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import "../../Dashboard/dashboard.access.scss";
// import fetchHourList from "../../../utils/fetchHourList";
// import addCourtFn from "../../../utils/addCourtFn";
// import fetchCourtTypeList from "../../../utils/fetchCourtTypeList";
// import logOutFn from "../../../utils/logOutFn";
// import fetchReservationList from "../../../utils/fetchReservationList";
// import LoadingScreen from "../../LoadingScreen/LoadingScreen.jsx";
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import Button from "@material-ui/core/Button";
// // import { makeStyles } from "@material-ui/core/styles";
// // import Autocomplete from "@material-ui/lab/Autocomplete";
// import TextField from "@material-ui/core/TextField";
// import moment from "moment";
// import "date-fns";
// import Grid from "@material-ui/core/Grid";
// import DateFnsUtils from "@date-io/date-fns";
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
// import ScrollContainer from "react-indiana-drag-scroll";
// import Schedule from "../Schedule.jsx";

// // const useStyles = makeStyles((theme) => ({
// //   formControl: {
// //     margin: theme.spacing(1),
// //     minWidth: 120,
// //   },
// //   selectEmpty: {
// //     marginTop: theme.spacing(2),
// //   },
// // }));

// const ClubDashboard = () => {
//   const schedule = useRef(null);
//   const dispatch = useDispatch();
//   const reservations = useSelector((state) => state.reservations);
//   const hours = useSelector((state) => state.hours);
//   const courts = useSelector((state) => state.courts);
//   const user = useSelector((state) => state.user);
//   const userType = useSelector((state) => state.userType);
//   // const [user, setUser] = useState("");
//   // const day = useSelector((state) => state.day);
//   const [day, setDay] = useState("");
//   const [name, setName] = useState("");
//   // const [userType, setUserType] = useState();
//   const [courtTypes, setCourtTypes] = useState([]);
//   const [courtType, setCourtType] = useState("");
//   const [courtNumber, setCourtNumber] = useState(0);
//   // const [courts, setCourts] = useState([]);
//   const [courtError, setCourtError] = useState("");
//   const [allLoaded, setAllLoaded] = useState(0);
//   // const classes = useStyles();
//   const [openTime, setOpenTime] = useState(
//     moment()
//       .second(0)
//       .minute(0)
//       .hour(8)
//   );
//   const [closeTime, setCloseTime] = useState(
//     moment()
//       .second(0)
//       .minute(0)
//       .hour(22)
//   );
//   const [selectedDate, setSelectedDate] = React.useState(new Date());
//   // const [hours, setHours] = useState([]);

//   useEffect(() => {
//     getClubInfo();
//     getDate();
//     fetchCourtTypes();
//     getCourts();
//     fetchHours();
//     fetchReservations();
//     if (schedule.current) return schedule.current.scrollTo(0, Math.random() * 5000);
//     // eslint-disable-next-line
//   }, []);

//   const fetchReservations = async () => {
//     const reservationList = await fetchReservationList();
//     dispatch({
//       type: "SET_RESERVATIONS",
//       payload: { reservations: reservationList },
//     });
//   };

//   const fetchHours = async () => {
//     const hourList = await fetchHourList(openTime, closeTime);
//     dispatch({
//       type: "SET_HOURS",
//       payload: { hours: hourList },
//     });
//   };

//   const getDate = async () => {
//     // dispatch({
//     //   type: "SET_DAY",
//     //   payload: { day: new moment() },
//     // });
//     setDay(moment());
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     // dispatch({
//     //   type: "SET_DAY",
//     //   payload: { day: moment(date) },
//     // });
//     setDay(moment(date));
//   };

//   const getCourts = async () => {
//     const res = await fetch("/api/dashboard/courts");
//     const parseRes = await res.json();
//     dispatch({
//       type: "SET_COURTS",
//       payload: { courts: parseRes },
//     });
//   };

//   const getClubInfo = async () => {
//     try {
//       const res = await fetch("/api/dashboard/clubs");
//       const parseRes = await res.json();
//       dispatch({
//         type: "SET_USER",
//         payload: {
//           user: parseRes.id,
//         },
//       });
//       // setUserType(parseRes.type);
//       dispatch({
//         type: "SET_USERTYPE",
//         payload: {
//           userType: parseRes.type,
//         },
//       });
//       setName(parseRes.name);

//       let openHours = moment(parseRes.open_time, "HH:mm:ss");
//       let closeHours = moment(parseRes.close_time, "HH:mm:ss");
//       let openMoment = moment()
//         .second(0)
//         .minute(openHours.minute())
//         .hour(openHours.hour());
//       let closeMoment = moment()
//         .second(0)
//         .minute(closeHours.minute())
//         .hour(closeHours.hour());
//       setOpenTime(openMoment);
//       setCloseTime(closeMoment);
//       setAllLoaded((prevState) => prevState + 1);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const fetchCourtTypes = async () => {
//     const courtTypeList = await fetchCourtTypeList();
//     setCourtTypes(courtTypeList);
//   };

//   const logOut = async () => {
//     const loggedOut = logOutFn();
//     dispatch({
//       type: "SET_AUTH",
//       payload: {
//         auth: loggedOut === true ? true : false,
//       },
//     });
//   };

//   const addCourt = async (event) => {
//     event.preventDefault();
//     const parseRes = await addCourtFn(courtType, courtNumber);
//     if (typeof parseRes !== "string") {
//       getCourts();
//       setCourtError("");
//     } else {
//       setCourtError(parseRes);
//     }
//   };

//   // you create/"declare" a moment with moment(variable/string, "the format of the variable/string") - the format is in order for moment to recognize what you're giving it
//   // if you want to assign it a specific time or date (usually it's what you have NOT provided inside the "moment()"), you do for example:
//   // moment(hour, "HH:mm")
//   //   .date(day.date())
//   // the first ".date()" is in order to tell it what you're assigning, the "day" is a moment object which has an entire date string and is the variable of a date where you're getting the day from, the second ".date()" inside () is where you are getting the day from the date string
//   // you continue doing the same with month, year, hour, minute or second
//   // if you want to display it as a string you do variable.format("format") - the format can be anything, since it has everything assigned, whether automatically, or manually by specifying the dates/times

//   const reserveTime = async (time, club, court) => {
//     try {
//       let chosenTime = moment(time, "HH:mm")
//         .date(day.date())
//         .month(day.month())
//         .year(day.year());
//       let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");
//       let endTime = chosenTime.add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

//       const body = { club, court, startTime, endTime };
//       // eslint-disable-next-line
//       const res = await fetch("/api/dashboard/reservations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       fetchReservations();
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   if (allLoaded !== 1) {
//     return <LoadingScreen />;
//   } else {
//     return (
//       <div>
//         <h1>Dashboard</h1>
//         <h1>
//           Hello {userType === 2 ? "club" : "player"} {name}
//         </h1>
//         <p id="logout" onClick={() => logOut()} data-dashboard>
//           Log out
//         </p>
//         {userType === 2 && (
//           <form onSubmit={(event) => addCourt(event)}>
//             <FormControl
//               variant="outlined"
//               size="small"
//               // className={classes.formControl}
//             >
//               <InputLabel id="court-type-input">Court type</InputLabel>
//               <Select
//                 labelId="court-type-select-label"
//                 id="court-type-select"
//                 value={courtType}
//                 onChange={(event) => setCourtType(event.target.value)}
//                 label="Court type"
//               >
//                 {courtTypes.map((courtType) => (
//                   <MenuItem key={courtType.id} value={courtType.id}>
//                     {courtType.type}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <TextField
//                 id="court-name"
//                 label="Court number"
//                 variant="outlined"
//                 autoComplete="off"
//                 onChange={(event) => setCourtNumber(event.target.value)}
//                 size="small"
//               />
//               <Button type="submit" variant="contained" color="primary">
//                 Add court
//               </Button>
//               <p>{courtError}</p>
//             </FormControl>
//           </form>
//         )}
//         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//           <Grid container justify="space-around">
//             <KeyboardDatePicker
//               margin="normal"
//               id="date-picker-dialog"
//               label="Date picker dialog"
//               format="dd/MM/yyyy"
//               value={selectedDate}
//               onChange={(date) => handleDateChange(date)}
//               KeyboardButtonProps={{
//                 "aria-label": "change date",
//               }}
//             />
//           </Grid>
//         </MuiPickersUtilsProvider>
//         {/* <Schedule /> */}
//         <ScrollContainer id="schedule" innerRef={schedule} hideScrollbars={false} data-dashboard>
//           {courts.map((court) => (
//             <div key={court.number}>
//               <p className="court-info" data-dashboard>
//                 Court {court.number} | {court.type}
//               </p>
//               <div className="hours" data-dashboard>
//                 {hours.map((hour) => {
//                   let color = "lightblue";
//                   reservations.map((reservation) => {
//                     if (court.id !== reservation.court) return false;
//                     let now = moment(hour, "HH:mm")
//                       .date(day.date())
//                       .month(day.month())
//                       .year(day.year());
//                     let startTime = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
//                     let endTime = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
//                     if (now.isSame(startTime) || now.isBetween(startTime, endTime)) {
//                       if (reservation.player === user) {
//                         color = "green";
//                       } else {
//                         color = "orange";
//                       }
//                       return false;
//                     }
//                     return true;
//                   });

//                   return (
//                     <div
//                       className="hour"
//                       style={{ backgroundColor: color }}
//                       key={hour}
//                       onClick={() => reserveTime(hour, court.club, court.id)}
//                       data-dashboard
//                     >
//                       <p>{hour}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </ScrollContainer>
//       </div>
//     );
//   }
// };

// export default ClubDashboard;
