import React from "react";
import "../components/Dashboard/styles/dashboard.scoped.scss";
import fetchReservationsUtil from "../utils/fetchReservationsUtil";
import deleteReservationUtil from "../utils/deleteReservationUtil";
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

const HourInfoModal = (props) => {
  const { court, hour, name, email, open } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date);

  const fetchReservations = async () => {
    const reservations = await fetchReservationsUtil();
    dispatch({
      type: "SET_RESERVATIONS",
      payload: { reservations: reservations },
    });
  };

  const deleteReservation = async (court, time) => {
    await deleteReservationUtil(court, time, date);
    props.setOpen();
    notify();
    fetchReservations();
  };

  const notify = () => toast.success("Reservation deleted");

  return (
    <Modal open={open} onClose={() => props.setOpen()} BackdropComponent={Backdrop}>
      <Fade in={open}>
        <div className={classes.paper}>
          <p>{name}</p>
          <p>{email}</p>
          <Button onClick={() => props.setOpen()} variant="contained">
            Close
          </Button>
          <Button onClick={() => deleteReservation(court.id, hour)} variant="contained" color="secondary">
            Delete
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default HourInfoModal;
