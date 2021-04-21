import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
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
    } catch (error) {
      console.error(error.message);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
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

  return (
    <div>
      Dashboard
      <h1>
        Hello {type === 2 ? "club" : "player"} {name}
      </h1>
      <button onClick={(e) => logOut(e)}>Logout</button>
    </div>
  );
};

export default Dashboard;
