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

// Have yet to put this into a global theme to avoid repetition across modal components
const useStyles = makeStyles((theme) => ({
  paper: {
    width: "90%",
    maxWidth: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

const ChangeNameModal = (props) => {
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

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  return (
    <>
      <div onClick={() => openModal()}>
        <i className="fas fa-user-alt menu-icon" data-header />
        Change name
      </div>
      <Modal open={open} className="mui-fixed" onClose={() => handleClose()}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 data-modals>Change name</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <FormControl fullWidth>
                <TextField
                  id="change-name"
                  label="New name"
                  variant="outlined"
                  autoComplete="off"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  size="small"
                />
                <small className="modal-margin-bottom" data-modals>
                  {error}
                </small>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default ChangeNameModal;
