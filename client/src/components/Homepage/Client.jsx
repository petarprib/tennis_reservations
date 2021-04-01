import React, { useState } from "react";
import "./homepage.scoped.scss";
import Select from "react-select";
// import { changeMode } from "./Helpers";

const Client = ({ countries }) => {
  const [login, setLogin] = useState(true);
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [center, setCenter] = useState(0);

  const fetchCenters = async (e) => {
    try {
      const res = await fetch(`http://localhost:5000/centers/${e.id}`);
      const data = await res.json();
      let centers = [];
      data.forEach((center) => centers.push({ value: center.name, label: center.name, id: center.id }));
      setCenters(centers);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password, center };
      await fetch("http://localhost:5000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    console.log(e);
  };

  const changeMode = () => {
    setLogin(!login);
    setName("");
    setEmail("");
    setPassword("");
    setRepeatedPassword("");
  };

  return (
    <>
      <form id="form" onSubmit={login ? (e) => onSubmitLogin(e) : (e) => onSubmitRegister(e)} data-home>
        <Select
          classNamePrefix="form-input"
          options={countries}
          placeholder="First select the country"
          onChange={(e) => fetchCenters(e)}
          data-home
        />
        <Select
          classNamePrefix="form-input"
          options={centers}
          placeholder="...and now the club"
          onChange={(e) => setCenter(e.id)}
          data-home
        />
        {!login && (
          <input
            className="form-input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-home
          />
        )}
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
        {!login && (
          <input
            className="form-input"
            type="password"
            placeholder="Repeat password"
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            data-home
          />
        )}
        <button>{login ? "Log in" : "Register"}</button>
      </form>
      <p onClick={() => changeMode()}>{login ? "Register" : "Log in"}</p>
    </>
  );
};

export default Client;
