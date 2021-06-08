import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

const AddCourt = (props) => {
  const { openAddCourtModal } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  // const [open, setOpen] = useState(false);
  const [courtError, setCourtError] = useState("");
  const [courtNumber, setCourtNumber] = useState("");
  const [courtType, setCourtType] = useState("");
  const courtTypes = useSelector((state) => state.courtTypes);

  const addCourt = async (event) => {
    event.preventDefault();
    const parseRes = await addCourtUtil(courtType, courtNumber);

    if (typeof parseRes !== "string") {
      fetchCourts();
      notify(courtNumber);
      setCourtNumber("");
      setCourtType("");
      setCourtError("");
      props.setOpenAddCourtModal();
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

  // const openModal = () => {
  //   setOpen(true);
  //   // props.handleClose();
  // };

  return (
    <>
      <Modal open={openAddCourtModal} className="mui-fixed" onClose={() => props.setOpenAddCourtModal(false)}>
        <Fade in={openAddCourtModal}>
          <div className={classes.paper}>
            <h2>Add court</h2>
            <form onSubmit={(event) => addCourt(event)}>
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
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default AddCourt;
