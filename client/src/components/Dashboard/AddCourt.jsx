import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import addCourtUtil from "../../utils/addCourtUtil";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourt = () => {
  const dispatch = useDispatch();
  const [courtError, setCourtError] = useState("");
  const [courtNumber, setCourtNumber] = useState("");
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);
  const userType = useSelector((state) => state.userType);

  const addCourt = async (event) => {
    event.preventDefault();
    const parseRes = await addCourtUtil(courtType, courtNumber);

    if (typeof parseRes !== "string") {
      fetchCourts();
      notify(courtNumber);
      setCourtNumber("");
      setCourtType("");
      setCourtError("");
    } else {
      setCourtError(parseRes);
    }
  };

  const fetchCourts = async () => {
    const res = await fetch("/api/dashboard/courts");
    const parseRes = await res.json();

    dispatch({
      type: "SET_COURTS",
      payload: { courts: parseRes },
    });
  };

  const handleCourtNumInput = (value) => {
    const onlyInt = /^[0-9\b]+$/;
    if (value === "" || onlyInt.test(value)) {
      setCourtNumber(value);
    }
  };

  const notify = (court) => toast.success(`Court ${court} added`);

  return (
    <div className="dashboard-forms" data-dashboard>
      {userType === 2 && (
        <form onSubmit={(event) => addCourt(event)}>
          {/* <FormControl
            variant="outlined"
            size="small"
            // className={classes.formControl}
          >
            <InputLabel id="court-type-input">Court type</InputLabel>
            <Select
              labelId="court-type-select-label"
              id="court-type-select"
              value={courtType}
              onChange={(event) => setCourtType(event.target.value)}
              label="Court type"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {courtTypes.map((courtType) => (
                <MenuItem key={courtType.id} value={courtType.id}>
                  {courtType.type}
                </MenuItem>
              ))}
            </Select>
            <TextField
              id="court-number"
              label="Court number"
              variant="outlined"
              autoComplete="off"
              value={courtNumber}
              onChange={(event) => handleCourtNumInput(event.target.value)}
              size="small"
            />
            <Button type="submit" variant="contained" color="primary">
              Add court
            </Button>
            <p>{courtError}</p>
          </FormControl> */}
        </form>
      )}
    </div>
  );
};

export default AddCourt;
