import React, { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Access from "./components/Access/Access.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";

const App = () => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
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
        type: "SET_AUTH",
        payload: {
          auth: parseRes === true ? true : false,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  if (auth === "loading") {
    return <LoadingScreen />;
  } else {
    return (
      <>
        <Switch>
          <Route path="/" exact render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/register" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-login" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-register" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/dashboard" render={() => (auth ? <Dashboard /> : <Redirect to="/" />)} />
        </Switch>
      </>
    );
  }
};

export default App;
