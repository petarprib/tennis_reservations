import React, { useState, useEffect } from "react";
import "../Dashboard/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import NewClubDashboard from "./Club/NewClubDashboard.jsx";
import PlayerDashboard from "./Player/PlayerDashboard.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import fetchCourtTypes from "../../utils/fetchCourtTypes";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(0);
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    getClubInfo();
    getCourtTypes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setReady((prevState) => prevState + 1);
  }, [userType]);

  const getClubInfo = async () => {
    try {
      const res = await fetch("/api/dashboard/session");
      const parseRes = await res.json();

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
      // setReady((prevState) => prevState + 1);
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

  // if (userType === 2) {
  //   return <NewClubDashboard />;
  // } else if (userType === 3) {
  //   return <PlayerDashboard />;
  // }
  //////////////////////////////////////////////
  // if (userType === "loading") {
  //   <LoadingScreen />;
  // } else {
  // if (userType === 2)
  //   return (
  //     <div>
  //       {console.log(userType)}
  //       {/* <p>Club</p> */}
  //       <NewClubDashboard />
  //     </div>
  //   );
  // else if (userType === 3)
  //   return (
  //     <div>
  //       {console.log(userType)}
  //       {/* <p>Player</p> */}
  //       <PlayerDashboard />
  //     </div>
  //   );
  // }
  //////////////////////////////////////////////
  if (userType === "loading") {
    return <LoadingScreen />;
  } else {
    return (
      <div id="dashboard" data-dashboard>
        {userType === 2 ? <NewClubDashboard userType={userType} /> : <PlayerDashboard userType={userType} />}
      </div>
    );
  }
};

export default Dashboard;
