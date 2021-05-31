import React from "react";
import { useSelector, useDispatch } from "react-redux";
import logOutFn from "../../utils/logOutFn";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const logOut = async () => {
    const loggedOut = logOutFn();
    dispatch({
      type: "SET_AUTH",
      payload: {
        auth: loggedOut === true ? true : false,
      },
    });
  };

  return (
    <div id="header" data-dashboard>
      <div id="header-content" data-dashboard>
        <div id="greeting" data-dashboard>
          <h1>Tennis Reservations</h1>
        </div>
        <div id="logout" className={classes.root} onClick={() => logOut()} data-dashboard>
          <Button size="small" variant="contained" color="primary">
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
