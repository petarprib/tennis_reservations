import React from "react";

import { useDispatch } from "react-redux";
import logOutFn from "../../../utils/logOutFn";
import AddCourt from "./AddCourt.jsx";
import ManageHours from "./ManageHours.jsx";
import Schedule from "../Schedule.jsx";

const NewClubDashboard = () => {
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

  // useEffect(() => {
  //   getClubInfo();
  //   // eslint-disable-next-line
  // }, []);

  // const getClubInfo = async () => {
  //   try {
  //     const res = await fetch("/api/dashboard/clubs");
  //     const parseRes = await res.json();
  //     console.log(parseRes);
  //     dispatch({
  //       type: "SET_USER",
  //       payload: {
  //         user: parseRes.id,
  //       },
  //     });
  //     dispatch({
  //       type: "SET_USER_TYPE",
  //       payload: {
  //         userType: parseRes.type,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  return (
    <>
      <p id="logout" onClick={() => logOut()} data-dashboard>
        Log out
      </p>
      <h1>NewClubDashboard</h1>
      <div id="club-dashboard-options-wrapper" data-dashboard>
        <AddCourt />
        <ManageHours />
      </div>
      <Schedule />
    </>
  );
};

export default NewClubDashboard;
