import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const ClubDashboard = () => {
  // const clubAuth = useSelector((state) => state.clubAuth);
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  useEffect(() => {
    getName();
  }, []);

  const getName = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/clubs", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await res.json();
      setName(parseRes.name);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    dispatch({
      type: "CHANGE_CLUBAUTH",
      payload: {
        clubAuth: false,
      },
    });
  };

  return (
    <div>
      Club dashboard
      <h1>Hi {name}</h1>
      <button onClick={(e) => logOut(e)}>Logout</button>
    </div>
  );
};

export default ClubDashboard;
