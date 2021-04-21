import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ".././access.scoped.scss";

const ClubLogin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const type = 2;
      const body = { email, password, type };
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
        parseRes.includes("email") ? setEmailError("This field is required") : setEmailError("");
        parseRes.includes("password") ? setPasswordError("This field is required") : setPasswordError("");
        parseRes.includes("login") ? setLoginError("Invalid login details") : setLoginError("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <h1>Club Login</h1>
      <div className="options" data-home>
        <Link to="/">Access as player</Link>
      </div>
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
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
        <small>{loginError}</small>
        <button type="submit">Log in</button>
      </form>
      <div className="options" data-home>
        <Link to="/club-register">New here? Register</Link>
      </div>
    </>
  );
};

export default ClubLogin;
