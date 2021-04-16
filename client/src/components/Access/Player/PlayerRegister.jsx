import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ".././access.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import fetchClubList from "../../../utils/fetchClubList";

const PlayerRegister = (props) => {
  const [countries, setCountries] = useState([]);
  const [clubs, setClubs] = useState([]);
  // const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [club, setClub] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

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
      const body = { club, name, email, password, type };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: parseRes === true ? true : false,
        },
      });
      push("/dashboard");
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
          options={countries}
          placeholder="Select country"
          onChange={(e) => fetchClubs(e)}
          data-home
        />
        <Select
          classNamePrefix="form-input"
          options={clubs}
          placeholder="Select club"
          onChange={(e) => setClub(e.id)}
          data-home
        />
        <input
          className="form-input"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <input
          className="form-input"
          type="password"
          placeholder="Repeat password"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
          data-home
        />
        <button>Register</button>
      </form>
      <div className="options" data-home>
        <Link to="/">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default PlayerRegister;
