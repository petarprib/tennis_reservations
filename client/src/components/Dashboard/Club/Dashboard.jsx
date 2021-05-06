import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.jsx";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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
  const [name, setName] = useState("");
  const [type, setType] = useState();
  const [courtTypes, setCourtTypes] = useState([]);
  const [courtType, setCourtType] = useState("");
  const [courtNumber, setCourtNumber] = useState(0);
  const [courts, setCourts] = useState([]);
  const [courtError, setCourtError] = useState("");
  const [allLoaded, setAllLoaded] = useState(0);
  // const classes = useStyles();

  useEffect(() => {
    getCourts();
    getClubInfo();
    getCourtTypes();
  }, []);

  useEffect(() => {}, [courts]);

  const getCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    setCourts([...parseRes]);
  };

  const getClubInfo = async () => {
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
      setCourtTypes([...parseRes]);
      console.log(...parseRes);
      // setCourtTypes([{ id: 0, type: "All" }, ...parseRes]); WHEN DISPLAYING COURTS FOR USERS
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
        setCourts([...courts, parseRes]);
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
            // className={classes.formControl}
            onSubmit={() => console.log("form submitted")}
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
            />
            <Button type="submit" variant="contained" color="primary">
              Add court
            </Button>
            <p>{courtError}</p>
          </FormControl>
        </form>
        <div>
          {courts.map((court) => (
            <p key={court.number}>{court.number}</p>
          ))}
        </div>
      </div>
    );
  }
};

export default Dashboard;
