import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import Select from "react-select";

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

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          type: "CHANGE_CLUBAUTH",
          payload: {
            clubAuth: true,
          },
        });
      } else {
        parseRes.includes("country") ? setCountryError("This field is required") : setCountryError("");
        parseRes.includes("name") ? setNameError("This field is required") : setNameError("");
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
      <h1>Club Register</h1>
      <div className="options" data-home>
        <Link to="/">Access as player</Link>
      </div>
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <Select
          classNamePrefix="form-input"
          options={countries}
          placeholder="Select country"
          onChange={(e) => setCountry(e.id)}
          data-home
        />
        <small>{countryError}</small>
        <input
          className="form-input"
          type="text"
          placeholder="Club name"
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
        <Link to="/club-login">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default ClubRegister;
