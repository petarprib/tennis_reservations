import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Access from "./components/Access/Access.jsx";
import ClubDashboard from "./components/Dashboard/Club/ClubDashboard.jsx";
// import PlayerDashboard from "./components/Dashboard/Player/PlayerDashboard.jsx";

const App = () => {
  const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();
  // const [isPlayerAuthenticated, setIsPlayerAuthenticated] = useState(false);
  // const [isClubAuthenticated, setIsClubAuthenticated] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log(clubAuth);
    isAuth();
  });

  const isAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token },
      });
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: parseRes === true ? true : false,
        },
      });

      // parseRes === true ? setIsClubAuthenticated(true) : setIsClubAuthenticated(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const setAuth = (boolean) => {
  //   setIsPlayerAuthenticated(boolean);
  // };

  // const setClubAuth = (boolean) => {
  //   console.log("function started");
  //   setIsClubAuthenticated(boolean);
  // };

  return (
    <div id="app">
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <Access />
              // <PlayerLogin
              //   {...props}
              //   // setAuth={setAuth}
              // />
            )}
          />
          <Route
            path="/register"
            render={(props) => (
              <Access />
              // <PlayerRegister
              //   {...props}
              //   // setAuth={setAuth}
              // />
            )}
          />
          <Route
            path="/club-login"
            render={
              (props) => <Access />
              // !isClubAuthenticated ? (
              //   <ClubLogin {...props} setClubAuth={setClubAuth} />
              // ) : (
              //   <Redirect to="/club-dashboard" />
              // )
            }
          />
          <Route
            path="/club-register"
            render={(props) => (!clubAuth ? <Access {...props} /> : <Redirect to="/club-dashboard" />)}
          />
          <Route
            path="/club-dashboard"
            render={(props) => (clubAuth ? <ClubDashboard {...props} /> : <Redirect to="/club-login" />)}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
