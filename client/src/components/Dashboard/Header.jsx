import React from "react";
import { useSelector, useDispatch } from "react-redux";
import logOutFn from "../../utils/logOutFn";

const Header = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);

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
    <div>
      <h1>Hello {userName}</h1>
      <p id="logout" onClick={() => logOut()} data-dashboard>
        Log out
      </p>
    </div>
  );
};

export default Header;
