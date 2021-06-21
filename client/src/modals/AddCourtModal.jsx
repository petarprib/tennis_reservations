import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles/modals.scoped.scss";
import { makeStyles } from "@material-ui/core/styles";
import addCourtUtil from "../utils/addCourtUtil";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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

const AddCourtModal = (props) => {
  const { openModal, closeModal } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [courtType, setCourtType] = useState("");
  const [courtTypeError, setCourtTypeError] = useState("");
  const [courtNumber, setCourtNumber] = useState("");
  const [courtNumberError, setCourtNumberError] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);

  const AddCourtModal = async (event) => {
    event.preventDefault();
    if (!courtType || !courtNumber) {
      if (!courtType) {
        setCourtTypeError("You must choose a court type");
      } else {
        setCourtTypeError("");
      }
      if (!courtNumber) {
        setCourtNumberError("The court doesn't have an assigned number");
      } else {
        setCourtNumberError("");
      }
    } else {
      const parseRes = await addCourtUtil(courtType, courtNumber);
      setCourtTypeError("");

      if (typeof parseRes !== "string") {
        fetchCourts();
        notify(courtNumber);
        setCourtNumber("");
        setCourtType("");
        setCourtNumberError("");
        closeModal();
      } else {
        setCourtNumberError(parseRes);
      }
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

  const handleCloseModal = () => {
    setCourtType("");
    setCourtNumber("");
    setCourtTypeError("");
    setCourtNumberError("");
    closeModal();
  };

  return (
    <>
      <Modal open={openModal} className="mui-fixed" onClose={() => handleCloseModal()}>
        <Fade in={openModal}>
          <div className={classes.paper}>
            <h2 data-modals>Add court</h2>
            <form onSubmit={(event) => AddCourtModal(event)}>
              <FormControl variant="outlined" size="small" fullWidth className="modal-margin-bottom" data-modals>
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
                <small data-modals>{courtTypeError}</small>
              </FormControl>
              <TextField
                id="court-number"
                label="Court number"
                variant="outlined"
                autoComplete="off"
                value={courtNumber}
                onChange={(event) => handleCourtNumInput(event.target.value)}
                size="small"
                fullWidth
              />
              <small className="modal-input-margins" data-modals>
                {courtNumberError}
              </small>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="modal-margin-top"
                data-modals
              >
                Add court
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default AddCourtModal;
