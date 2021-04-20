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

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const fetchClubs = async (e) => {
    setCountry(e.id);
    const clubList = await fetchClubList(e.id);
    setClubs(clubList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              "Must have minimum 8 characters of which at least 1 letter, 1 number and 1 one special character"
            )
          : setPasswordError("");
        parseRes.includes("repPassword") ? setRepPasswordError("Passwords do not match") : setRepPasswordError("");
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
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <Select
          classNamePrefix="form-input"
          selected
          options={countries}
          placeholder="Select country"
          onChange={(e) => fetchClubs(e)}
          data-home
        />
        <small>{countryError}</small>
        <Select
          classNamePrefix="form-input"
          options={clubs}
          placeholder="Select club"
          onChange={(e) => setClub(e.id)}
          data-home
        />
        <small>{clubError}</small>
        <input
          className="form-input"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-home
        />
        <small>{nameError}</small>
        <input
          className="form-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-home
        />
        <small>{emailError}</small>
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-home
        />
        <small>{passwordError}</small>
        <input
          className="form-input"
          type="password"
          placeholder="Repeat password"
          value={repPassword}
          onChange={(e) => setRepPassword(e.target.value)}
          data-home
        />
        <small>{repPasswordError}</small>
        <button>Register</button>
      </form>
      <div className="options" data-home>
        <Link to="/">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default PlayerRegister;
