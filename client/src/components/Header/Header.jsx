import React from "react";
import "./styles/header.scoped.scss";
import { useDispatch } from "react-redux";
import logOutUtil from "../../utils/logOutUtil";
import { makeStyles } from "@material-ui/core/styles";

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
    const loggedOut = logOutUtil();
    dispatch({
      type: "SET_AUTH",
      payload: {
        auth: loggedOut === true ? true : false,
      },
    });
  };

  return (
    <div id="header" data-header>
      <div id="header-content" data-header>
        <div id="header-title" data-header>
          <img
            src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/tennis-court-svgrepo-com_SqosYyvPx.svg"
            alt="logo"
            data-header
          />
          <h1>Dashboard</h1>
        </div>
        <div id="logout" className={classes.root} onClick={() => logOut()} data-header>
          <i className="fas fa-sign-out-alt" />
        </div>
      </div>
    </div>
  );
};

export default Header;
