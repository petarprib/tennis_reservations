import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Dashboard = () => {
  const clubAuth = useSelector((state) => state.clubAuth);
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
      console.log(parseRes);
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
      console.error("Error:", error.message);
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
