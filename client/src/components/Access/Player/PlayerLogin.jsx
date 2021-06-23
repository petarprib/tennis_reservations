import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import fetchClubListUtil from "../../../utils/fetchClubListUtil";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";

const PlayerLogin = (props) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const [loaded, setLoaded] = useState(true);
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
    const clubList = await fetchClubListUtil(id);
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
            auth: parseRes,
          },
        });
      } else {
        setCountryError(country === 0 ? "This field is required" : "");
        setClubError(parseRes.includes("club") ? "This field is required" : "");
        setEmailError(parseRes.includes("email") ? "This field is required" : "");
        setPasswordError(parseRes.includes("password") ? "This field is required" : "");
        setLoginError(parseRes.includes("login") ? "Invalid login details" : "");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fade in={loaded} timeout={500}>
      <div>
        <h1>Player Login</h1>
        <div className="options" data-access>
          <Link to="/club-login">Access as club</Link>
        </div>
        <form onSubmit={(event) => handleSubmit(event)} data-access>
          <FormControl fullWidth>
            <div className="input-error-div" data-access>
              <Autocomplete
                id="select-country"
                options={countries}
                getOptionLabel={(country) => country.name}
                size="small"
                onChange={(event, value) => {
                  if (!value) return;
                  fetchClubs(value.id);
                }}
                renderInput={(params) => <TextField {...params} label="Select country" variant="outlined" />}
              />
              <small>{countryError}</small>
            </div>
            <div className="input-error-div" data-access>
              <Autocomplete
                id="select-club"
                options={clubs}
                getOptionLabel={(club) => club.name}
                onChange={(event, value) => {
                  if (!value) return;
                  setClub(value.id);
                }}
                size="small"
                renderInput={(params) => <TextField {...params} label="Select club" variant="outlined" />}
              />
              <small>{clubError}</small>
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
            <Button className="button" type="submit" variant="contained" color="primary" data-access>
              Log in
            </Button>
            <small>{loginError}</small>
          </FormControl>
        </form>
        <div className="options" data-access>
          <Link to="/register">New here? Register</Link>
        </div>
      </div>
    </Fade>
  );
};

export default PlayerLogin;
