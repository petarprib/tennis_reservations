import React, { useState } from "react";
import "./styles/header.scoped.scss";
import { useDispatch } from "react-redux";
import logOutUtil from "../../utils/logOutUtil";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ChangeNameModal from "../../modals/ChangeNameModal.jsx";
import ChangeEmailModal from "../../modals/ChangeEmailModal.jsx";
import ChangePasswordModal from "../../modals/ChangePasswordModal.jsx";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid rgb(211, 211, 211)",
  },
})((props) => (
  <Menu
    elevation={2}
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

const Header = () => {
  const dispatch = useDispatch();
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
        auth: loggedOut,
      },
    });

    // eslint-disable-next-line
    window.location.href = window.location.href;
  };

  return (
    <nav data-header>
      <div id="header-content" data-header>
        <div id="header-logo" data-header>
          <img
            src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/tennis-court-svgrepo-com_SqosYyvPx.svg"
            alt="logo"
            data-header
          />
        </div>
        <div>
          <div onClick={(event) => handleClick(event)} id="user-menu" data-header>
            <i className="fas fa-bars" data-header />
          </div>
          <StyledMenu
            disableScrollLock={true}
            anchorEl={menuOpen}
            keepMounted
            open={Boolean(menuOpen)}
            onClose={() => setMenuOpen(null)}
            data-header
          >
            <MenuItem>
              <ChangeNameModal handleClose={() => handleClose()} />
            </MenuItem>
            <MenuItem>
              <ChangeEmailModal handleClose={() => handleClose()} />
            </MenuItem>
            <MenuItem>
              <ChangePasswordModal handleClose={() => handleClose()} />
            </MenuItem>
            <MenuItem onClick={logOut}>
              <i className="fas fa-sign-out-alt menu-icon" data-header />
              Log out
            </MenuItem>
          </StyledMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
