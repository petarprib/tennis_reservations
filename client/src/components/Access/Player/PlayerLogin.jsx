import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import Select from "react-select";
import fetchClubList from "../../../utils/fetchClubList";

const PlayerLogin = (props) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          type: "CHANGE_CLUBAUTH",
          payload: {
            clubAuth: true,
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

  const customStyles = {
    clearIndicator: (provided, state) => ({
      ...provided,
    }),
    container: (provided, state) => ({
      ...provided,
    }),
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      boxShadow: state.isFocused ? "0px 0px 0px 1px #6b8e23" : "none",
      border: "solid 1px #a9a9a9",
      "&:hover": {
        borderColor: "#a9a9a9",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
    }),
    group: (provided, state) => ({
      ...provided,
    }),
    groupHeading: (provided, state) => ({
      ...provided,
    }),
    indicatorContainer: (provided, state) => ({
      ...provided,
      color: "red",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
    }),
    input: (provided, state) => ({
      ...provided,
    }),
    loadingIndicator: (provided, state) => ({
      ...provided,
    }),
    loadingMessage: (provided, state) => ({
      ...provided,
    }),
    menu: (provided, state) => ({
      ...provided,
    }),
    menuList: (provided, state) => ({
      ...provided,
    }),
    menuPortal: (provided, state) => ({
      ...provided,
    }),
    multiValue: (provided, state) => ({
      ...provided,
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
    }),
    option: (provided, state) => ({
      ...provided,
      // color: state.isFocused ? "#fff" : "#696969",
      // backgroundColor: state.isFocused ? "#6b8e23" : null,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "#696969",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#696969",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: "2px 5px",
    }),
  };

  return (
    <>
      <h1>Player Login</h1>
      <div className="options" data-home>
        <Link to="/club-login">Access as club</Link>
      </div>
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <div className="input-error-div" data-home>
          <Select
            styles={customStyles}
            options={countries}
            placeholder="Select country"
            onChange={(e) => fetchClubs(e.value)}
            data-home
          />
          <small>{countryError}</small>
        </div>
        <div className="input-error-div" data-home>
          <Select
            styles={customStyles}
            options={clubs}
            placeholder="Select club"
            onChange={(e) => setClub(e.value)}
            data-home
          />
          <small>{clubError}</small>
        </div>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            data-home
          />
          <small>{passwordError}</small>
        </div>
        <small>{loginError}</small>
        <button>Log in</button>
      </form>
      <div className="options" data-home>
        <Link to="/register">New here? Register</Link>
      </div>
    </>
  );
};

export default PlayerLogin;
