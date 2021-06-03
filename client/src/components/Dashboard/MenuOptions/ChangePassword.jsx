import React, { useState } from "react";
import changePasswordUtil from "../../../utils/changePasswordUtil";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const ChangePassword = () => {
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
      setNewPassword("");
      setRepNewPassword("");
      setCurrentPassword("");
      setNewPasswordError("");
      setRepNewPasswordError("");
      setCurrentPasswordError("");
    }
  };

  return (
    <div>
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
  );
};

export default ChangePassword;
