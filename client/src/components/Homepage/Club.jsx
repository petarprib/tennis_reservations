import React, { useState } from "react";
import "./homepage.scoped.scss";
import Select from "react-select";

const Club = ({ countries }) => {
  const [login, setLogin] = useState(true);
  const [country, setCountry] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  // const [center, setCenter] = useState(0);

  const onSubmitRegister = async (e) => {
    // console.log("country: ", country);
    e.preventDefault();
    try {
      const body = { name, email, password, country };
      await fetch("http://localhost:5000/centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // console.log(body);
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
        {!login && (
          <>
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
          </>
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
      <p onClick={() => changeMode()}>{login ? "Register" : "Login"}</p>
    </>
  );
};

export default Club;
