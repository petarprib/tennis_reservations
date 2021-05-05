import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [allLoaded, setAllLoaded] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState();

  useEffect(() => {
    getNameAndType();
  }, []);

  const getNameAndType = async () => {
    try {
      const res = await fetch("/api/dashboard/clubs");
      const parseRes = await res.json();
      setType(parseRes.type);
      setName(parseRes.name);
      setAllLoaded((prevState) => prevState + 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logOut = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/logout");
      const parseRes = await res.json();
      dispatch({
        type: "CHANGE_CLUBAUTH",
        payload: {
          clubAuth: parseRes === true ? true : false,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
    }
  };

  if (allLoaded !== 1) {
    return <LoadingScreen />;
  } else {
    return (
      <div>
        Dashboard
        <h1>
          Hello {type === 2 ? "club" : "player"} {name}
        </h1>
        <button onClick={(event) => logOut(event)}>Logout</button>
      </div>
    );
  }
};

export default Dashboard;
