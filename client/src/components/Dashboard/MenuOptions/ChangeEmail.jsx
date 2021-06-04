import React, { useState } from "react";
import changeEmailUtil from "../../../utils/changeEmailUtil";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changeEmailUtil(newEmail);
    if (typeof parseRes === "string") {
      return setError(parseRes);
    }
    notify();
    setNewEmail("");
    setError("");
  };

  const notify = () => toast.success("Email successfully changed");

  return (
    <div className="dashboard-forms" data-dashboard>
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
  );
};

export default ChangeEmail;
