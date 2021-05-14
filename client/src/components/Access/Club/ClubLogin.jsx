import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ".././access.scoped.scss";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";

const ClubLogin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      <form id="form" onSubmit={(event) => handleSubmit(event)} data-home>
        <FormControl
          variant="outlined"
          size="small"
          // className={classes.formControl}
        >
          <div className="input-error-div" data-home>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              autoComplete="off"
              fullWidth
              onChange={(event) => setEmail(event.target.value)}
            />
            <small>{emailError}</small>
          </div>
          <div className="input-error-div" data-home>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              type="password"
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
            />
            <small>{passwordError}</small>
          </div>
          <small>{loginError}</small>
          {/* <button type="submit">Log in</button> */}
          <Button type="submit" variant="contained" color="primary">
            Log in
          </Button>
        </FormControl>
      </form>
      <div className="options" data-home>
        <Link to="/club-register">New here? Register</Link>
      </div>
    </>
  );
};

export default ClubLogin;
