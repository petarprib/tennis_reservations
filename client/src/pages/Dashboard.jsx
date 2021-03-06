import React, { useState, useEffect } from "react";
import "../components/Dashboard/styles/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header/Header.jsx";
import fetchCourtTypesUtil from "../utils/fetchCourtTypesUtil";
import Schedule from "../components/Dashboard/Schedule/Schedule.jsx";
import ConfigOpenHoursModal from "../components/Modals/ConfigOpenHoursModal";
import AddCourtButton from "../components/Dashboard/Tools/AddCourtButton.jsx";
import ScheduleFilter from "../components/Dashboard/Tools/ScheduleFilter.jsx";
import ColorGuide from "../components/Dashboard/Tools/ColorGuide.jsx";
import Fade from "@material-ui/core/Fade";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [noCourts, setNoCourts] = useState(false);
  const courts = useSelector((state) => state.courts);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const userType = useSelector((state) => state.userData.userType);

  useEffect(() => {
    handleResize();
    fetchCourts();
    fetchEssentialData();
    fetchCourtTypes();
    setTimeout(() => {
      setNoCourts(true);
    }, 1000);
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
        type: "SET_USER_DATA",
        payload: {
          userData: {
            userName: parseRes.name,
            user: parseRes.accountId,
            userType: parseRes.accountType,
            club: parseRes.club,
          },
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
                  <Fade in={noCourts} timeout={500}>
                    <div className="no-courts" data-dashboard>
                      <p>It seems no court has been added</p>
                      <img
                        src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/sadsmiley_4lfUL6lgU.png"
                        alt="sadface"
                      />
                      <p>Click on the plus button to add one</p>
                    </div>
                  </Fade>
                </>
              );
            } else if (userType === 3) {
              return (
                <Fade in={noCourts} timeout={500}>
                  <div className="no-courts" data-dashboard>
                    <p>Sorry, it seems no courts have been added</p>
                    <img
                      src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/sadsmiley_4lfUL6lgU.png"
                      alt="sadface"
                    />
                  </div>
                </Fade>
              );
            }
          }
        })()}
      </div>
    </>
  );
  // }
};

export default Dashboard;
