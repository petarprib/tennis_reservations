import React, { useState, useEffect } from "react";
import "./styles/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import Header from "../Header/Header.jsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";
import fetchCourtTypesUtil from "../../utils/fetchCourtTypesUtil";
import Schedule from "./Schedule.jsx";
import ConfigOpenHours from "./modals/ConfigOpenHours.jsx";
import AddCourtModal from "./modals/AddCourtModal.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const courts = useSelector((state) => state.courts);
  const [openAddCourtModal, setOpenAddCourtModal] = useState(false);

  useEffect(() => {
    fetchCourts();
    fetchEssentialData();
    fetchCourtTypes();
    // eslint-disable-next-line
  }, []);

  const fetchCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();

    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
    dispatch({
      type: "SET_FILTERED_COURTS",
      payload: { filteredCourts: parseRes },
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
        <div id="dashboard" data-dashboard>
          {userType === 2 && <ConfigOpenHours />}
          {(() => {
            if (courts.length > 0) {
              return <Schedule />;
            } else {
              if (userType === 2) {
                return (
                  <>
                    <p>
                      No courts added, click <span onClick={() => setOpenAddCourtModal(true)}>here</span> to add
                    </p>
                    <AddCourtModal
                      openAddCourtModal={openAddCourtModal}
                      setOpenAddCourtModal={() => setOpenAddCourtModal(false)}
                    />
                  </>
                );
              }
              if (userType === 3) {
                return <p>No court yet, sorry</p>;
              }
            }
          })()}
        </div>
      </>
    );
  }
};

export default Dashboard;
