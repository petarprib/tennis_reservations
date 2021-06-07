import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import changeEmailUtil from "../../../utils/changeEmailUtil";
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

const ChangeEmail = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changeEmailUtil(newEmail);
    if (typeof parseRes === "string") {
      return setError(parseRes);
    }
    notify();
    setOpen(false);
    setNewEmail("");
    setError("");
  };

  const openModal = () => {
    setOpen(true);
    props.handleClose();
  };

  const notify = () => toast.success("Email successfully changed");

  return (
    <>
      <div onClick={() => openModal()}>
        <i className="fas fa-at menu-icon" data-header />
        Change email
      </div>
      <Modal open={open} className="mui-fixed" onClose={() => setOpen(false)}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>Change email</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <FormControl
                variant="outlined"
                size="small"
                // className={classes.formControl}
              >
                <TextField
                  id="change-email"
                  label="New email"
                  variant="outlined"
                  autoComplete="off"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  size="small"
                />
                <small>{error}</small>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </FormControl>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default ChangeEmail;
