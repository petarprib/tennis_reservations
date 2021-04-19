import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ".././access.scoped.scss";
import { useDispatch } from "react-redux";
import Select from "react-select";
import fetchClubList from "../../../utils/fetchClubList";

const PlayerLogin = (props) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [countries, setCountries] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const fetchClubs = async (e) => {
    const clubList = await fetchClubList(e.id);
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
        setError(parseRes);
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
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <Select
          classNamePrefix="form-dropdown"
          options={countries}
          placeholder="First select the country"
          onChange={(e) => fetchClubs(e)}
          data-home
        />
        <Select
          classNamePrefix="form-dropdown"
          options={clubs}
          placeholder="...and now the club"
          onChange={(e) => setClub(e.id)}
          data-home
        />
        <input
          className="form-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-home
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-home
        />
        <p>{error}</p>
        <button>Log in</button>
      </form>
      <div className="options" data-home>
        <Link to="/register">New here? Register</Link>
      </div>
    </>
  );
};

export default PlayerLogin;
