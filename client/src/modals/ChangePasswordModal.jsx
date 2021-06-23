import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import changePasswordUtil from "../utils/changePasswordUtil";
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

const ChangePasswordModal = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repNewPassword, setRepNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [repNewPasswordError, setRepNewPasswordError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changePasswordUtil(newPassword, repNewPassword, currentPassword);
    if (typeof parseRes === "object") {
      setNewPasswordError(
        parseRes.includes("newPassword")
          ? "Must have minimum 8 characters of which at least 1 letter, 1 number and 1 special character"
          : ""
      );
      setRepNewPasswordError(parseRes.includes("repNewPassword") ? "Your new password inputs do not match" : "");
      setCurrentPasswordError(parseRes.includes("currentPassword") ? "Your password is incorrect" : "");
    } else {
      notify();
      setOpen(false);
      setNewPassword("");
      setRepNewPassword("");
      setCurrentPassword("");
      setNewPasswordError("");
      setRepNewPasswordError("");
      setCurrentPasswordError("");
    }
  };

  const notify = () => toast.success("Password successfully changed");

  const openModal = () => {
    setOpen(true);
    props.handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setNewPasswordError("");
    setRepNewPasswordError("");
    setCurrentPasswordError("");
  };

  return (
    <>
      <div onClick={() => openModal()}>
        <i className="fas fa-key menu-icon" data-header />
        Change password
      </div>
      <Modal open={open} className="mui-fixed" onClose={() => handleClose(false)}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 data-modals>Change password</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <FormControl fullWidth>
                <TextField
                  id="new-password"
                  label="New password"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  size="small"
                />
                <small className="modal-margin-bottom" data-modals>
                  {newPasswordError}
                </small>
                <TextField
                  id="rep-new-password"
                  label="Repeat new password"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={repNewPassword}
                  onChange={(event) => setRepNewPassword(event.target.value)}
                  size="small"
                />
                <small className="modal-margin-bottom" data-modals>
                  {repNewPasswordError}
                </small>
                <TextField
                  id="current-password"
                  label="Current password"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  size="small"
                />
                <small className="modal-margin-bottom" data-modals>
                  {currentPasswordError}
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

export default ChangePasswordModal;
