import React, { useState } from "react";
import { useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AddCourtModal from "../../Modals/AddCourtModal.jsx";

const AddCourtButton = () => {
  const [openModal, setOpenModal] = useState(false);
  const courts = useSelector((state) => state.courts);

  return (
    <div id={!courts.length ? "no-courts-add-court" : "add-court-button"} data-dashboard>
      <Fab color="primary" aria-label="add" onClick={() => setOpenModal(true)} data-dashboard>
        <AddIcon />
      </Fab>
      <AddCourtModal openModal={openModal} closeModal={() => setOpenModal(false)} />
    </div>
  );
};

export default AddCourtButton;
