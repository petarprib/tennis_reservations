import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ChangeName from "./ChangeName.jsx";
import ChangeEmail from "./ChangeEmail.jsx";
import ChangePassword from "./ChangePassword.jsx";
import AddCourt from "./AddCourt.jsx";

const MenuOptions = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);

  const changeSection = (section) => {
    dispatch({
      type: "SET_SECTION",
      payload: { section: section },
    });
  };

  return (
    <div className="dashboard-functions" data-dashboard>
      <div>
        <p onClick={() => changeSection(<ChangeName />)} data-dashboard>
          Change name
        </p>
      </div>
      <div>
        <p onClick={() => changeSection(<ChangeEmail />)} data-dashboard>
          Change email
        </p>
      </div>
      <div>
        <p onClick={() => changeSection(<ChangePassword />)} data-dashboard>
          Change password
        </p>
      </div>

      {userType === 2 && (
        <div>
          <p onClick={() => changeSection(<AddCourt />)} data-dashboard>
            Add court
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuOptions;
