import React, { useState } from "react";
import "../styles/dashboard.scoped.scss";
import reserveTimeUtil from "../../../utils/reserveTimeUtil";
import fetchReservationsUtil from "../../../utils/fetchReservationsUtil";
import deleteReservationUtil from "../../../utils/deleteReservationUtil";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: "none",
    boxShadow: "none",
    outline: "none",
    padding: "20px",
    borderRadius: "5px",
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const PlayerReservationInfoModal = (props) => {
  const { court, hour, color, nameAcronym, playerReservation, name, email } = props;
  const classes = useStyles();
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

  const deleteReservation = async (court, time) => {
    await deleteReservationUtil(court, time, date);
    setOpen(false);
    notify();
    fetchReservations();
  };

  const notify = () => toast.success("Reservation deleted");

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
      <Modal open={open} onClose={() => setOpen(false)} BackdropComponent={Backdrop}>
        <Fade in={open}>
          <div className={classes.paper}>
            <p>{name}</p>
            <p>{email}</p>
            <Button onClick={() => setOpen(false)} variant="contained">
              Close
            </Button>
            <Button onClick={() => deleteReservation(court.id, hour)} variant="contained" color="secondary">
              Delete
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default PlayerReservationInfoModal;
