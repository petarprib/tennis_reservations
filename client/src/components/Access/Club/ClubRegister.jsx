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
              "Must have minimum 8 characters of which at least 1 letter, 1 number and 1 special character"
            )
          : setPasswordError("");
        parseRes.includes("repPassword") ? setRepPasswordError("Passwords do not match") : setRepPasswordError("");
        parseRes.includes("club exists") ? setExistsError("Club with email already exists") : setExistsError("");
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
      <form id="form" onSubmit={(event) => handleSubmit(event)} data-home>
        <div className="input-error-div" data-home>
          <Select
            classNamePrefix="form-input"
            options={countries}
            placeholder="Select country"
            onChange={(event) => setCountry(event.target.value)}
            data-home
          />
          <small>{countryError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="text"
            placeholder="Club name"
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
        <Link to="/club-login">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default ClubRegister;
