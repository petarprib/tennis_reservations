import React, { useState, useEffect } from "react";
import "./styles/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Header from "../Header/Header.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import fetchCourtTypesUtil from "../../utils/fetchCourtTypesUtil";
import Schedule from "./Schedule/Schedule.jsx";
import ConfigOpenHoursModal from "../../modals/ConfigOpenHoursModal.jsx";
import AddCourtButton from "./Tools/AddCourtButton.jsx";
import ScheduleFilter from "./Tools/ScheduleFilter.jsx";
import ColorGuide from "./Tools/ColorGuide.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const courts = useSelector((state) => state.courts);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    handleResize();
    fetchCourts();
    fetchEssentialData();
    fetchCourtTypes();
    // eslint-disable-next-line
  }, []);

  const handleResize = () => {
    const setNewWith = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", setNewWith);
    return () => window.removeEventListener("resize", setNewWith);
  };

  const fetchCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();

    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
  };

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
        <div id={!courts.length ? "no-courts-dashboard" : "dashboard"} data-dashboard>
          {userType === 2 && <ConfigOpenHoursModal />}
          {(() => {
            if (courts.length > 0) {
              if (windowWidth <= 350) {
                return (
                  <>
                    <div id="dashboard-tools" data-dashboard>
                      {userType === 2 && <AddCourtButton />}
                      <ScheduleFilter />
                      <ColorGuide />
                    </div>
                    <Schedule />
                  </>
                );
              }
              if (windowWidth > 350 && windowWidth <= 768) {
                return (
                  <>
                    <div id="dashboard-tools" data-dashboard>
                      <div>
                        <ScheduleFilter />
                      </div>
                      <div>
                        {userType === 2 && <AddCourtButton />}
                        <ColorGuide />
                      </div>
                    </div>
                    <Schedule />
                  </>
                );
              }
              if (windowWidth > 768) {
                return (
                  <>
                    <div id={userType === 2 ? "dashboard-tools" : "dashboard-tools-player"} data-dashboard>
                      {userType === 2 && <AddCourtButton />}
                      <ScheduleFilter />
                      <ColorGuide />
                    </div>
                    <Schedule />
                  </>
                );
              }
            } else {
              if (userType === 2) {
                return (
                  <>
                    <AddCourtButton />
                    <div className="no-courts" data-dashboard>
                      <p>It seems no court has been added</p>
                      <img
                        src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/sadsmiley_4lfUL6lgU.png"
                        alt="sadface"
                      />
                      <p>Click on the plus button to add one</p>
                    </div>
                  </>
                );
              } else if (userType === 3) {
                return (
                  <div className="no-courts" data-dashboard>
                    <p>Sorry, it seems no courts have been added</p>
                    <img
                      src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/sadsmiley_4lfUL6lgU.png"
                      alt="sadface"
                    />
                  </div>
                );
              }
            }
          })()}
        </div>
      </>
    );
  }
};

export default Dashboard;
