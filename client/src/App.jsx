import React, { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Access from "./components/Access/Access.jsx";
import ClubDashboard from "./components/Dashboard/Club/Dashboard.jsx";
import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";

const App = () => {
  const location = useLocation();
  const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    isAuth();
    // eslint-disable-next-line
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

  const loader = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;

  if (clubAuth === "loading") {
    return <SyncLoader color={"#C6ED2C"} css={loader} size={20} />;
  } else {
    return (
      <>
        <Switch>
          <Route path="/" exact render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/register" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-login" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-register" render={() => (!clubAuth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/dashboard" render={() => (clubAuth ? <ClubDashboard /> : <Redirect to="/" />)} />
        </Switch>
      </>
    );
  }
};

export default App;
