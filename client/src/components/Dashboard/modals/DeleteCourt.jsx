import React, { useState } from "react";
import { useDispatch } from "react-redux";
import deleteCourtUtil from "../../../utils/deleteCourtUtil";
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

const DeleteCourt = (props) => {
  const { courtId, courtNumber } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const fetchCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();
    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
  };

  const deleteCourt = async (court) => {
    await deleteCourtUtil(court);
    notify(courtNumber);
    fetchCourts();
  };

  const notify = (courtNumber) => toast.success(`Court ${courtNumber} deleted`);

  return (
    <div>
      <i className="fas fa-trash" onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} BackdropComponent={Backdrop}>
        <Fade in={open}>
          <div className={classes.paper}>
            <p>Are you sure you want to delete court {courtNumber}?</p>
            <Button onClick={() => setOpen(false)} variant="contained" color="">
              Cancel
            </Button>
            <Button onClick={() => deleteCourt(courtId)} variant="contained" color="secondary">
              Delete
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default DeleteCourt;
