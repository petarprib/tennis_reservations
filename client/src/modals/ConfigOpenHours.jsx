import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Modal from "@material-ui/core/Modal";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";

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

const EditCourt = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState();
  const [closeTime, setCloseTime] = useState();

  useEffect(() => {
    fetchWorkingHours();
    // eslint-disable-next-line
  }, []);

  const fetchWorkingHours = async () => {
    try {
      const res = await fetch("/api/dashboard/initial-club-config");
      const parseRes = await res.json();
      if (!parseRes.config_open_hours) {
        setOpen(true);
        setOpenTime(moment(parseRes.open_time, "HH:mm:ss").toDate());
        setCloseTime(moment(parseRes.close_time, "HH:mm:ss").toDate());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formatOpenTime = moment(openTime).format("HH:mm");
      const formatCloseTime = moment(closeTime).format("HH:mm");
      const body = { formatOpenTime, formatCloseTime };
      await fetch("/api/dashboard/initial-club-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      dispatch({
        type: "SET_OPEN_TIME",
        payload: { openTime: moment(openTime) },
      });
      dispatch({
        type: "SET_CLOSE_TIME",
        payload: { closeTime: moment(closeTime) },
      });
      setOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal
      style={{ zIndex: "900" }}
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={() => setOpen(false)}
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2>Initial configuration</h2>

          <form id="form" onSubmit={(event) => handleSubmit(event)} data-access>
            <FormControl
              variant="outlined"
              size="small"
              // className={classes.formControl}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  ampm={false}
                  minutesStep={30}
                  margin="normal"
                  id="open-time-picker"
                  label="Select opening time"
                  value={openTime}
                  onChange={(time) => setOpenTime(time)}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                />
                <KeyboardTimePicker
                  ampm={false}
                  minutesStep={30}
                  margin="normal"
                  id="close-time-picker"
                  label="Select closing time"
                  value={closeTime}
                  onChange={(time) => setCloseTime(time)}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </FormControl>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default EditCourt;
