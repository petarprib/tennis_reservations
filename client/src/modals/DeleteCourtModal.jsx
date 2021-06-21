import React from "react";
import { useDispatch } from "react-redux";
import deleteCourtUtil from "../utils/deleteCourtUtil";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "90%",
    maxWidth: "300px",
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

const DeleteCourtModal = (props) => {
  const { open, courtId, courtNumber } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [open, props.close] useState(false);

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
    <Modal open={open} onClose={() => props.close()} BackdropComponent={Backdrop}>
      <Fade in={open}>
        <div className={classes.paper}>
          <p className="modal-margin-bottom" data-modals>
            Are you sure you want to delete court {courtNumber}?
          </p>
          <ButtonGroup variant="contained" fullWidth>
            {/* <Button onClick={() => handleClose()} variant="contained">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button> */}
            <Button onClick={() => props.close()} variant="contained">
              Cancel
            </Button>
            <Button onClick={() => deleteCourt(courtId)} variant="contained" color="secondary">
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteCourtModal;
