import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  paper: {
    // width: "400px",
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

const EditCourtModal = () => {
  const classes = useStyles();
  const configOpenHours = useSelector((state) => state.configOpenHours);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (configOpenHours) setOpen(true);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal disableBackdropClick disableEscapeKeyDown open={open} onClose={() => setOpen(false)}>
        <div className={classes.paper}>
          <h2>Initial configuration</h2>
        </div>
      </Modal>
    </div>
  );
};

export default EditCourtModal;
