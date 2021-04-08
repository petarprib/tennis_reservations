import React, { useState } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";

const ClubLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      localStorage.setItem("token", parseRes.token);
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
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-home
        />
        <button type="submit">Log in</button>
      </form>
      <div className="options" data-home>
        <Link to="/club-register">New here? Register</Link>
      </div>
    </>
  );
};

export default ClubLogin;
