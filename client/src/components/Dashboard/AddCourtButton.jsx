import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const AddCourtButton = () => {
  return (
    // <div id="add-court-button" data-dashboard>
    <Fab id="add-court-button" data-dashboard color="primary" aria-label="add">
      <AddIcon />
    </Fab>
    // </div>
  );
};

export default AddCourtButton;
