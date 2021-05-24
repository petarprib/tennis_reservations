import React from "react";
import { useDispatch } from "react-redux";
import logOutFn from "../../../utils/logOutFn";
import Schedule from "../Schedule.jsx";

// display playerdashboard or clubdashboard component depending on usertype. check at what moment usertype should be determined and set in global state

const PlayerDashboard = () => {
  const dispatch = useDispatch();

  const logOut = async () => {
    const loggedOut = logOutFn();
    dispatch({
      type: "SET_AUTH",
      payload: {
        auth: loggedOut === true ? true : false,
      },
    });
  };

  return (
    <div>
      <p id="logout" onClick={() => logOut()} data-dashboard>
        Log out
      </p>
      <h1>PlayerDashboard</h1>
      <Schedule />
    </div>
  );
};

export default PlayerDashboard;
