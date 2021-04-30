import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import Select from "react-select";
import fetchClubList from "../../../utils/fetchClubList";

const PlayerLogin = (props) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [updatedCountries, setUpdatedCountries] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [country, setCountry] = useState(0);
  const [countryInput, setCountryInput] = useState("");
  const [openCountries, setOpenCountries] = useState(false);
  const [focusedCountry, setFocusedCountry] = useState(-1);
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
    setUpdatedCountries(props.countries);
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

  const handleCountryInput = (e) => {
    setOpenCountries(true);
    setCountryInput(e.target.value);
    let newCountries = [];
    countries.forEach((country) => {
      if (country.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        newCountries.push({ name: country.name, id: country.id });
      }
    });

    setUpdatedCountries(newCountries);
  };

  const handleCountrySelect = (country) => {
    setOpenCountries(false);
    fetchClubs(country.id);
    setCountryInput(country.name);
    setCountry(country.id);
  };

  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown") {
      if (focusedCountry === updatedCountries.length - 1) {
        return setFocusedCountry(0);
      }
      setOpenCountries(true);
      setFocusedCountry((prevState) => prevState + 1);
    }
    if (e.code === "ArrowUp") {
      if (focusedCountry === 0) {
        return setFocusedCountry(236);
      }
      setFocusedCountry((prevState) => prevState - 1);
    }
  };

  return (
    <>
      <h1>Player Login</h1>
      <div className="options" data-home>
        <Link to="/club-login">Access as club</Link>
      </div>
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <div className="input-error-div" data-home>
          <input
            className="form-input"
            type="text"
            placeholder="Select country"
            onChange={(e) => handleCountryInput(e)}
            onClick={() => setOpenCountries(!openCountries)}
            onKeyDown={(e) => handleKeyDown(e)}
            value={countryInput}
            data-home
          />
          {openCountries && (
            <ul className="country-list" data-home>
              {!updatedCountries.length ? (
                <li className="no-options" data-home>
                  No options
                </li>
              ) : (
                updatedCountries.map((country, i) => (
                  <li
                    key={i}
                    tabIndex="0"
                    className={`option ${focusedCountry === i ? "country-item-focused" : null}`}
                    onClick={() => handleCountrySelect(country)}
                    data-home
                  >
                    {country.name}
                  </li>
                ))
              )}
            </ul>
          )}
          <small>{countryError}</small>
        </div>
        {/* <Select
            styles={customStyles}
            options={countries}
            placeholder="Select country"
            onChange={(e) => fetchClubs(e.value)}
            data-home
          /> */}
        <div className="input-error-div" data-home>
          {/* <Select
            // styles={customStyles}
            options={clubs}
            placeholder="Select club"
            onChange={(e) => setClub(e.value)}
            data-home
          /> */}
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
