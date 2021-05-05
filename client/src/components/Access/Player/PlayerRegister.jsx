import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import Select from "react-select";
import fetchClubList from "../../../utils/fetchClubList";

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

  const fetchClubs = async (event) => {
    setCountry(event.target.value);
    const clubList = await fetchClubList(event.target.value);
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
          <Select
            classNamePrefix="form-input"
            selected
            options={countries}
            placeholder="Select country"
            onChange={(event) => fetchClubs(event)}
            data-home
          />
          <small>{countryError}</small>
        </div>
        <div className="input-error-div" data-home>
          <Select
            classNamePrefix="form-input"
            options={clubs}
            placeholder="Select club"
            onChange={(event) => setClub(event.target.value)}
            data-home
          />
          <small>{clubError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-home
          />
          <small>{nameError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            data-home
          />
          <small>{emailError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            data-home
          />
          <small>{passwordError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="password"
            placeholder="Repeat password"
            value={repPassword}
            onChange={(event) => setRepPassword(event.target.value)}
            data-home
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
