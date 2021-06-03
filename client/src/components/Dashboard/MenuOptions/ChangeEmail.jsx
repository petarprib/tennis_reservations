import React, { useState } from "react";
import changeEmailUtil from "../../../utils/changeEmailUtil";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changeEmailUtil(newEmail);
    if (typeof parseRes === "string") {
      return setError(parseRes);
    }
    setNewEmail("");
    setError("");
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
