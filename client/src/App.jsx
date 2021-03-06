import React, { useEffect } from "react";
import "./App.scss";
import theme from "./styles/theme.jsx";
import { MuiThemeProvider } from "@material-ui/core";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Access from "./pages/Access.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";

const App = () => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    checkStatus();
  });

  useEffect(() => {
    isAuth();
    // eslint-disable-next-line
  }, [location.pathname, location.search]);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      console.log(data.status);
      return data.status;
    } catch (error) {
      console.error(error.message);
    }
  };

  const isAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      const parseRes = await res.json();
      return dispatch({
        type: "SET_AUTH",
        payload: {
          auth: parseRes,
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
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route path="/" exact render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/register" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-login" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/club-register" render={() => (!auth ? <Access /> : <Redirect to="/dashboard" />)} />
          <Route path="/dashboard" render={() => (auth ? <Dashboard /> : <Redirect to="/" />)} />
        </Switch>
      </MuiThemeProvider>
    );
  }
};

export default App;
