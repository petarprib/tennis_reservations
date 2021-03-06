import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";

const ClubLogin = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const [loaded, setLoaded] = useState(true);
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
          type: "SET_AUTH",
          payload: {
            auth: parseRes,
          },
        });
      } else {
        setEmailError(parseRes.includes("email") ? "This field is required" : "");
        setPasswordError(parseRes.includes("password") ? "This field is required" : "");
        setLoginError(parseRes.includes("login") ? "Invalid login details" : "");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fade in={loaded} timeout={500}>
      <div>
        <h1>Club Login</h1>
        <div className="options" data-access>
          <Link to="/">Access as player</Link>
        </div>
        <form onSubmit={(event) => handleSubmit(event)} data-access>
          <FormControl fullWidth>
            <div className="input-error-div" data-access>
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
            <div className="input-error-div" data-access>
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
            <Button className="button" type="submit" variant="contained" color="primary" data-access>
              Log in
            </Button>
            <small>{loginError}</small>
          </FormControl>
        </form>
        <div className="options" data-access>
          <Link to="/club-register">New here? Register</Link>
        </div>
      </div>
    </Fade>
  );
};

export default ClubLogin;
