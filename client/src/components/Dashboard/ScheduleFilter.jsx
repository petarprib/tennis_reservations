import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

const ScheduleFilter = () => {
  const dispatch = useDispatch();
  const courtType = useSelector((state) => state.courtType);
  const filteredCourtTypes = useSelector((state) => state.filteredCourtTypes);
  const selectedDate = useSelector((state) => state.selectedDate);

  const handleDateChange = (date) => {
    dispatch({
      type: "SET_SELECTED_DATE",
      payload: { selectedDate: date },
    });
    dispatch({
      type: "SET_DATE",
      payload: { date: moment(date) },
    });
  };

  return (
    <div id="schedule-filter" data-dashboard>
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            inputVariant="outlined"
            size="small"
            margin="normal"
            id="date-picker"
            label="Date"
            format="dd/MM/yyyy"
            value={selectedDate}
            onChange={(date) => handleDateChange(date)}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div>
        <FormControl
          variant="outlined"
          size="small"
          // className={classes.formControl}
        >
          <InputLabel id="court-type-input">Court type</InputLabel>
          <Select
            MenuProps={{ disableScrollLock: true }}
            labelId="court-type-select-label"
            id="court-type-select"
            value={courtType}
            onChange={(event) => dispatch({ type: "SET_COURT_TYPE", payload: { courtType: event.target.value } })}
            label="Court type"
          >
            {filteredCourtTypes.map((courtType) => (
              <MenuItem key={courtType.id} value={courtType.id}>
                {courtType.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default ScheduleFilter;
