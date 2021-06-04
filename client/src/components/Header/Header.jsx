import React, { useState } from "react";
import "./styles/header.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import logOutUtil from "../../utils/logOutUtil";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid rgb(211, 211, 211)",
  },
})((props) => (
  <Menu
    elevation={3}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

///////////////////////////////////////////

const Header = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleClick = (event) => {
    menuOpen === null ? setMenuOpen(event.currentTarget) : setMenuOpen(null);
  };

  const handleClose = () => {
    setMenuOpen(null);
  };

  const logOut = async () => {
    setMenuOpen(null);
    const loggedOut = await logOutUtil();
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
        </div>
        <div>
          <div onClick={(event) => handleClick(event)} id="user-menu" data-header>
            <p>{userName}</p>
            {menuOpen ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />}
          </div>
          <StyledMenu
            disableScrollLock={true}
            anchorEl={menuOpen}
            keepMounted
            open={Boolean(menuOpen)}
            onClose={handleClose}
            data-header
          >
            <MenuItem onClick={handleClose}>
              <i className="fas fa-user-alt menu-icon" data-header />
              Change name
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <i className="fas fa-at menu-icon" data-header />
              Change email
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <i className="fas fa-key menu-icon" data-header />
              Change password
            </MenuItem>
            <MenuItem onClick={logOut}>
              <i className="fas fa-sign-out-alt menu-icon" data-header />
              Log out
            </MenuItem>
          </StyledMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
