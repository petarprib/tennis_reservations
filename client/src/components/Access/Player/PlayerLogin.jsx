import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import fetchClubList from "../../../utils/fetchClubList";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&. MuiAutocomplete-listbox": {
      backgroundColor: "red",
    },
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    // border: "solid 5px red",
    // borderRadius: "15px",
    // borderRadius: 3,
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    // color: "white",
    // height: 48,
    // padding: "0 30px",
  },
});

const PlayerLogin = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [country, setCountry] = useState(0);
  const [countryError, setCountryError] = useState("");
  const [club, setClub] = useState("");
  const [clubError, setClubError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const fetchClubs = async (id) => {
    setCountry(id);
    const clubList = await fetchClubList(id);
    setClubs(clubList);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const type = 3;
      const body = { club, email, password, type };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      if (parseRes === true) {
        dispatch({
          type: "SET_AUTH",
          payload: {
            auth: true,
          },
        });
      } else {
        country === 0 ? setCountryError("This field is required") : setCountryError("");
        parseRes.includes("club") ? setClubError("This field is required") : setClubError("");
        parseRes.includes("email") ? setEmailError("This field is required") : setEmailError("");
        parseRes.includes("password") ? setPasswordError("This field is required") : setPasswordError("");
        parseRes.includes("login") ? setLoginError("Invalid login details") : setLoginError("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <h1>Player Login</h1>
      <div className="options" data-home>
        <Link to="/club-login">Access as club</Link>
      </div>
      <form id="form" onSubmit={(event) => handleSubmit(event)} data-home>
        <FormControl
          fullWidth
          // className={classes.formControl}
        >
          <div className="input-error-div" data-home>
            <Autocomplete
              id="select-country"
              options={countries}
              getOptionLabel={(country) => country.name}
              size="small"
              className={classes.root}
              onChange={(event, value) => {
                if (!value) return;
                fetchClubs(value.id);
              }}
              renderInput={(params) => <TextField {...params} label="Select country" variant="outlined" />}
            />
            <small>{countryError}</small>
          </div>
          <div className="input-error-div" data-home>
            <Autocomplete
              id="select-club"
              options={clubs}
              getOptionLabel={(club) => club.name}
              onChange={(event, value) => {
                if (!value) return;
                setClub(value.id);
              }}
              size="small"
              className={classes.root}
              renderInput={(params) => <TextField {...params} label="Select club" variant="outlined" />}
            />
            <small>{clubError}</small>
          </div>
          <div className="input-error-div" data-home>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              autoComplete="off"
              fullWidth
              onChange={(event) => setEmail(event.target.value)}
            />
            <small>{emailError}</small>
          </div>
          <div className="input-error-div" data-home>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              type="password"
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
            />
            <small>{passwordError}</small>
          </div>
          <small>{loginError}</small>
          <Button type="submit" variant="contained" color="primary">
            Log in
          </Button>
        </FormControl>
      </form>
      <div className="options" data-home>
        <Link to="/register">New here? Register</Link>
      </div>
    </>
  );
};

export default PlayerLogin;
