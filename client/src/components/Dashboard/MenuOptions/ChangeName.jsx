import React, { useState } from "react";
import changeNameUtil from "../../../utils/changeNameUtil";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeName = () => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let parseRes = await changeNameUtil(newName);
    if (typeof parseRes === "string") {
      return setError(parseRes);
    }
    notify();
    setNewName("");
    setError("");
  };

  const notify = () => toast.success("Name successfully changed");

  return (
    <div className="dashboard-forms" data-dashboard>
      <form onSubmit={(event) => handleSubmit(event)}>
        <FormControl
          variant="outlined"
          size="small"
          // className={classes.formControl}
        >
          <TextField
            id="change-name"
            label="New name"
            variant="outlined"
            autoComplete="off"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
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

export default ChangeName;
