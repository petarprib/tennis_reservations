import React, { useState, useEffect } from "react";
import "./styles/header.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import logOutUtil from "../../utils/logOutUtil";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ChangeName from "../../modals/ChangeName.jsx";
import ChangeEmail from "../../modals/ChangeEmail.jsx";
import ChangePassword from "../../modals/ChangePassword.jsx";

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
  const userName = useSelector((state) => state.userName);
  const [menuOpen, setMenuOpen] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div id="header-logo" data-header>
          <img
            src="https://ik.imagekit.io/w1xennnidd/tennis_reservations/tennis-court-svgrepo-com_SqosYyvPx.svg"
            alt="logo"
            data-header
          />
        </div>
        <div>
          <div onClick={(event) => handleClick(event)} id="user-menu" data-header>
            <i class="fas fa-bars" data-header />
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
              <ChangeName handleClose={() => handleClose()} />
            </MenuItem>
            <MenuItem>
              <ChangeEmail handleClose={() => handleClose()} />
            </MenuItem>
            <MenuItem>
              <ChangePassword handleClose={() => handleClose()} />
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
