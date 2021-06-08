import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import changePasswordUtil from "../../../utils/changePasswordUtil";
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

const ChangePassword = (props) => {
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

  return (
    <>
      <div onClick={() => openModal()}>
        <i className="fas fa-key menu-icon" data-header />
        Change password
      </div>
      <Modal open={open} className="mui-fixed" onClose={() => setOpen(false)}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>Change password</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <FormControl
                variant="outlined"
                size="small"
                // className={classes.formControl}
              >
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
                <small>{newPasswordError}</small>
                <TextField
                  id="rep-new-password"
                  label="Rep new password"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={repNewPassword}
                  onChange={(event) => setRepNewPassword(event.target.value)}
                  size="small"
                />
                <small>{repNewPasswordError}</small>
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
                <small>{currentPasswordError}</small>
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

export default ChangePassword;
