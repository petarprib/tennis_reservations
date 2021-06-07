import React, { useState } from "react";
import "./styles/dashboard.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import reserveTimeUtil from "../../utils/reserveTimeUtil";
import fetchReservationsUtil from "../../utils/fetchReservationsUtil";
import "react-toastify/dist/ReactToastify.css";
import HourInfoModal from "./modals/HourInfoModal";

const Hour = (props) => {
  const { court, hour, color, nameAcronym, playerReservation, name, email } = props;
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date);
  const [open, setOpen] = useState(false);
  const userType = useSelector((state) => state.userType);

  const fetchReservations = async () => {
    const reservations = await fetchReservationsUtil();
    dispatch({
      type: "SET_RESERVATIONS",
      payload: { reservations: reservations },
    });
  };

  const reserveTime = async (time, club, court) => {
    if (playerReservation && userType === 2) {
      setOpen(true);
    } else {
      await reserveTimeUtil(time, club, court, date);
      fetchReservations();
    }
  };

  return (
    <div>
      <div
        className="hour"
        style={{ backgroundColor: color }}
        onClick={() => reserveTime(hour, court.club, court.id)}
        data-dashboard
      >
        {userType === 2 && <p>{nameAcronym}</p>}
      </div>
      <HourInfoModal
        court={court}
        hour={hour}
        playerReservation={playerReservation}
        name={name}
        email={email}
        open={open}
        setOpen={() => setOpen(false)}
      />
    </div>
  );
};

export default Hour;
