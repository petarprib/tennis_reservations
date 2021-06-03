import React, { useEffect } from "react";
import "./styles/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Header from "../Header/Header.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import fetchCourtTypesUtil from "../../utils/fetchCourtTypesUtil";
import Sections from "./Sections.jsx";
import Schedule from "./Schedule.jsx";
import ConfigOpenHoursModal from "./modals/ConfigOpenHoursModal.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    fetchEssentialData();
    fetchCourtTypes();
    // eslint-disable-next-line
  }, []);

  const fetchEssentialData = async () => {
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

  const fetchCourtTypes = async () => {
    const courtTypes = await fetchCourtTypesUtil();
    dispatch({
      type: "SET_COURT_TYPES",
      payload: { courtTypes },
    });
  };

  if (userType === "loading") {
    return <LoadingScreen />;
  } else {
    return (
      <>
        <Header />
        <div id="dashboard" data-dashboard>
          {userType === 2 && <ConfigOpenHoursModal />}
          <Sections />
          <Schedule />
        </div>
      </>
    );
  }
};

export default Dashboard;
