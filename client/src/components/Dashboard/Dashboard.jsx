import React, { useEffect } from "react";
import "../Dashboard/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import NewClubDashboard from "./Club/NewClubDashboard.jsx";
import PlayerDashboard from "./Player/PlayerDashboard.jsx";
import Header from "./Header.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import fetchCourtTypes from "../../utils/fetchCourtTypes";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    getEssentialData();
    getCourtTypes();
    // eslint-disable-next-line
  }, []);

  const getEssentialData = async () => {
    try {
      const res = await fetch("/api/dashboard/session");
      const parseRes = await res.json();

      dispatch({
        type: "SET_USER_NAME",
        payload: {
          userName: parseRes.name,
        },
      });
      dispatch({
        type: "SET_USER",
        payload: {
          user: parseRes.accountId,
        },
      });
      dispatch({
        type: "SET_USER_TYPE",
        payload: {
          userType: parseRes.accountType,
        },
      });
      dispatch({
        type: "SET_CLUB",
        payload: {
          club: parseRes.club,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const getCourtTypes = async () => {
    const courtTypes = await fetchCourtTypes();
    dispatch({
      type: "SET_COURT_TYPES",
      payload: { courtTypes: courtTypes },
    });
  };

  if (userType === "loading") {
    return <LoadingScreen />;
  } else {
    return (
      <>
        <Header />
        {(() => {
          if (userType === 2) {
            return <NewClubDashboard />;
          } else if (userType === 3) {
            return <PlayerDashboard />;
          }
        })()}
      </>
    );
  }
};

export default Dashboard;
