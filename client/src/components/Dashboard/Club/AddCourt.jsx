import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import addCourtFn from "../../../utils/addCourtFn";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const AddCourt = () => {
  const dispatch = useDispatch();
  const [courtError, setCourtError] = useState("");
  const [courtNumber, setCourtNumber] = useState("");
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);
  const userType = useSelector((state) => state.userType);

  const addCourt = async (event) => {
    event.preventDefault();
    const parseRes = await addCourtFn(courtType, courtNumber);

    if (typeof parseRes !== "string") {
      getCourts();
      setCourtNumber("");
      setCourtType("");
      setCourtError("");
    } else {
      setCourtError(parseRes);
    }
  };

  const getCourts = async () => {
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

  return (
    // <div className="club-dashboard-options" data-dashboard>
    <>
      {userType === 2 && (
        <form className="club-dashboard-option" onSubmit={(event) => addCourt(event)} data-dashboard>
          <FormControl
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
          </FormControl>
        </form>
      )}
    </>
    // </div>
  );
};

export default AddCourt;
