import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "90%",
    maxWidth: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  const { open, courtId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [courtNumber, setCourtNumber] = useState("");
  const [emptyInputError, setEmptyInputError] = useState("");
  const [courtError, setCourtError] = useState("");
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);
  // const [open, props.close] = useState(false);

  useEffect(() => {
    setCourtNumber(props.courtNumber);
    setCourtType(props.courtType);
    // eslint-disable-next-line
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (courtNumber !== "") {
        const body = { courtId, courtNumber, courtType };
        const res = await fetch("/api/dashboard/courts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const parseRes = await res.json();
        if (typeof parseRes !== "string") {
          props.close();
          fetchCourts();
          setCourtError("");
          notify();
        } else {
          setCourtError(parseRes);
        }
      } else {
        setEmptyInputError("The court number field can't be empty");
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

  const handleClose = () => {
    props.close();
    setEmptyInputError("");
    setCourtError("");
  };

  return (
    <Modal open={open} className="mui-fixed" onClose={() => handleClose()}>
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 data-modals>Edit court info</h2>
          <form id="form" onSubmit={(event) => handleSubmit(event)} data-access>
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
            <small data-modals>{emptyInputError}</small>
            <FormControl
              variant="outlined"
              size="small"
              fullWidth
              className="modal-margin-top"
              data-modals
              // className={classes.formControl}
            >
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
              <small data-modals>{courtError}</small>
              <ButtonGroup variant="contained" className="modal-margin-top" data-modals fullWidth>
                <Button onClick={() => handleClose()} variant="contained">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </ButtonGroup>
            </FormControl>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default EditCourtModal;
