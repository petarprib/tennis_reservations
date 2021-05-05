import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import fetchClubList from "../../../utils/fetchClubList";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const PlayerRegister = (props) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [country, setCountry] = useState(0);
  const [countryError, setCountryError] = useState("");
  const [club, setClub] = useState("");
  const [clubError, setClubError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [repPasswordError, setRepPasswordError] = useState("");
  const [existsError, setExistsError] = useState("");

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
      const body = { club, name, email, password, repPassword, type };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      if (parseRes === true) {
        dispatch({
          type: "CHANGE_CLUBAUTH",
          payload: {
            clubAuth: true,
          },
        });
      } else {
        country === 0 ? setCountryError("This field is required") : setCountryError("");
        parseRes.includes("club") ? setClubError("This field is required") : setClubError("");
        parseRes.includes("name") ? setNameError("Name and surname are required") : setNameError("");
        parseRes.includes("email") ? setEmailError("Invalid email") : setEmailError("");
        parseRes.includes("password")
          ? setPasswordError(
              "Must have minimum 8 characters of which at least 1 letter, 1 number and 1 special character"
            )
          : setPasswordError("");
        parseRes.includes("repPassword") ? setRepPasswordError("Passwords do not match") : setRepPasswordError("");
        parseRes.includes("player exists") ? setExistsError("Player already exists") : setExistsError("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <h1>Player Register</h1>
      <div className="options" data-home>
        <Link to="/club-login">Access as club</Link>
      </div>
      <form id="form" onSubmit={(event) => handleSubmit(event)} data-home>
        <div className="input-error-div" data-home>
          <Autocomplete
            id="select-country"
            options={countries}
            getOptionLabel={(country) => country.name}
            size="small"
            // className={classes.root}
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
            // className={classes.root}
            renderInput={(params) => <TextField {...params} label="Select club" variant="outlined" />}
          />
          <small>{clubError}</small>
        </div>
        <div className="input-error-div" data-home>
          <TextField
            id="name"
            label="Full name"
            variant="outlined"
            size="small"
            fullWidth
            onChange={(event) => setName(event.target.value)}
          />
          <small>{nameError}</small>
        </div>
        <div className="input-error-div" data-home>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            size="small"
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
        <div className="input-error-div" data-home>
          <TextField
            id="repeat-password"
            label="Repeat password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            onChange={(event) => setRepPassword(event.target.value)}
          />
          <small>{repPasswordError}</small>
        </div>
        <small>{existsError}</small>
        <button>Register</button>
      </form>
      <div className="options" data-home>
        <Link to="/">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default PlayerRegister;
