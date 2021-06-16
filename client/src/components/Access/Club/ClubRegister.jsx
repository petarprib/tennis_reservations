import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";

const ClubRegister = (props) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(0);
  const [countryError, setCountryError] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const type = 2;
      const body = { country, name, email, password, repPassword, type };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      if (parseRes === true) {
        dispatch({
          type: "SET_AUTH",
          payload: {
            auth: parseRes,
          },
        });
      } else {
        setCountryError(parseRes.includes("country") ? "This field is required" : "");
        setNameError(parseRes.includes("name") ? "This field is required" : "");
        setEmailError(parseRes.includes("email") ? "Invalid email" : "");
        setPasswordError(
          parseRes.includes("password")
            ? "Must have minimum 8 characters of which at least 1 letter, 1 number and 1 special character"
            : ""
        );
        setRepPasswordError(parseRes.includes("repPassword") ? "Password do not match" : "");
        setExistsError(parseRes.includes("club exists") ? "Club with email already exists" : "");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <h1>Club Register</h1>
      <div className="options" data-access>
        <Link to="/">Access as player</Link>
      </div>
      <form id="form" onSubmit={(event) => handleSubmit(event)} data-access>
        <FormControl
          fullWidth
          // className={classes.formControl}
        >
          <div className="input-error-div" data-access>
            <Autocomplete
              id="select-country"
              options={countries}
              getOptionLabel={(country) => country.name}
              size="small"
              // className={classes.root}
              onChange={(event, value) => {
                if (!value) return;
                setCountry(value.id);
              }}
              renderInput={(params) => <TextField {...params} label="Select country" variant="outlined" />}
            />
            <small>{countryError}</small>
          </div>
          <div className="input-error-div" data-access>
            <TextField
              id="name"
              label="Club name"
              variant="outlined"
              size="small"
              autoComplete="off"
              fullWidth
              onChange={(event) => setName(event.target.value)}
            />
            <small>{nameError}</small>
          </div>
          <div className="input-error-div" data-access>
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
          <div className="input-error-div" data-access>
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
          <div className="input-error-div" data-access>
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
          <Button className="button" type="submit" variant="contained" color="primary" data-access>
            Register
          </Button>
        </FormControl>
      </form>
      <div className="options" data-access>
        <Link to="/club-login">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default ClubRegister;
