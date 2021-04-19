import React, { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Access from "./components/Access/Access.jsx";
import ClubDashboard from "./components/Dashboard/Club/Dashboard.jsx";
// import PlayerDashboard from "./components/Dashboard/Player/PlayerDashboard.jsx";

const App = () => {
  const location = useLocation();
  const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    isAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const isAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: parseRes === true ? true : false,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  if (clubAuth === "loading") {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div id="app">
        <Switch>
          <Route path="/" exact render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/register" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-login" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-register" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/dashboard" render={() => (clubAuth ? <ClubDashboard /> : <Redirect to="/" />)} />
        </Switch>
      </div>
    );
  }
};

export default App;
