import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import changeNameUtil from "../utils/changeNameUtil";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
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

const ChangeName = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changeNameUtil(newName);
    if (typeof parseRes === "string") {
      return setError(parseRes);
    }
    notify();
    setOpen(false);
    setNewName("");
    setError("");
  };

  const openModal = () => {
    setOpen(true);
    props.handleClose();
  };

  const notify = () => toast.success("Name successfully changed");

  return (
    <>
      <div onClick={() => openModal()}>
        <i className="fas fa-user-alt menu-icon" data-header />
        Change name
      </div>
      <Modal open={open} className="mui-fixed" onClose={() => setOpen(false)}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>Change name</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <input type="text" />
              <input type="text" />
              <input type="text" />
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default ChangeName;
