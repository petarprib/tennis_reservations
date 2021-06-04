import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    // width: "400px",
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

const EditCourtModal = (props) => {
  const { courtId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [courtNumber, setCourtNumber] = useState("");
  const [courtError, setCourtError] = useState("");
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCourtNumber(props.courtNumber);
    setCourtType(props.courtType);
    // eslint-disable-next-line
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = { courtId, courtNumber, courtType };
      const res = await fetch("/api/dashboard/courts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await res.json();
      if (typeof parseRes !== "string") {
        setOpen(false);
        fetchCourts();
        setCourtError("");
        notify();
      } else {
        setCourtError(parseRes);
      }
    } catch (error) {
      console.error(error.message);
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

  const notify = () => toast.success("Court successfully edited");

  return (
    <div>
      <i className="fas fa-edit" onClick={() => setOpen(true)} />
      <Modal open={open} className="mui-fixed" onClose={() => setOpen(false)}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>Edit court info</h2>
            <form id="form" onSubmit={(event) => handleSubmit(event)} data-access>
              <FormControl
                variant="outlined"
                size="small"
                // className={classes.formControl}
              >
                <TextField
                  id="number"
                  label="Court number"
                  value={courtNumber}
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  fullWidth
                  onChange={(event) => handleCourtNumInput(event.target.value)}
                />
                <InputLabel id="court-type-input">Court type</InputLabel>
                <Select
                  labelId="court-type-select-label"
                  id="court-type-select"
                  value={courtType}
                  onChange={(event) => setCourtType(event.target.value)}
                  label="Court type"
                >
                  {courtTypes.map((courtType) => (
                    <MenuItem key={courtType.id} value={courtType.id}>
                      {courtType.type}
                    </MenuItem>
                  ))}
                </Select>
                <small>{courtError}</small>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setOpen(false)} variant="contained" color="secondary">
                  Cancel
                </Button>
              </FormControl>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default EditCourtModal;
