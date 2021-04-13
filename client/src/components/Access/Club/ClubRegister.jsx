import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ".././access.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

const ClubRegister = (props) => {
  const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const type = 2;
      const body = { country, name, email, password, type };
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: true,
        },
      });
      push("/club-dashboard");
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
        <input
          className="form-input"
          type="text"
          placeholder="Club name"
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
        <Link to="/club-login">Already registered? Log in</Link>
      </div>
    </>
  );
};

export default ClubRegister;
