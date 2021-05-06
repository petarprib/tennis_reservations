import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.jsx";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
// import NativeSelect from "@material-ui/core/NativeSelect";
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
  const [courtTypes, setCourtTypes] = useState([]);
  const [courtType, setCourtType] = useState("");
  const [courtName, setCourtName] = useState("");
  const [allLoaded, setAllLoaded] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState();
  // const classes = useStyles();
  // const [age, setAge] = useState("");

  useEffect(() => {
    getNameAndType();
    getCourtTypes();
  }, []);

  const getNameAndType = async () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
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
            <InputLabel id="demo-simple-select-outlined-label">Court type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={courtType}
              onChange={(event) => setCourtType(event.target.value)}
              label="Court type"
              name="courtType"
            >
              {courtTypes.map((courtType) => (
                <MenuItem key={courtType.id} value={courtType.id}>
                  {courtType.type}
                </MenuItem>
              ))}
            </Select>
            <TextField
              name="name"
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              autoComplete="off"
              onChange={(event) => setCourtName(event.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Add court
            </Button>
          </FormControl>
        </form>
      </div>
    );
  }
};

export default Dashboard;
