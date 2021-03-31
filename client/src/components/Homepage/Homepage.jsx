import React, { useState, useEffect } from "react";
import "./homepage.scoped.scss";
import Client from "./Client.jsx";
import Club from "./Club.jsx";
// import { useSelector, useDispatch } from "react-redux";

const Homepage = () => {
  // const dispatch = useDispatch();
  const [tab, setTab] = useState(true);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:5000/countries");
      const data = await res.json();
      let countries = [];
      data.forEach((country) => countries.push({ value: country.name, label: country.name, id: country.id }));
      setCountries(countries);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // const clientsTab = useSelector((state) => state.clientsTab);
  // console.log(clientsTab);

  // const setClientsTab = (boolean) => {
  //   dispatch({ type: "SET_CLIENTS_TAB", payload: boolean });
  // };

  return (
    <div id="background" data-home>
      <div id="box" data-home>
        <div id="tabs" data-home>
          <div className={`tab ${tab ? "shown" : "hidden"}`} onClick={() => setTab(true)} data-home>
            <p>Clients</p>
          </div>
          <div className={`tab ${!tab ? "shown" : "hidden"}`} onClick={() => setTab(false)} data-home>
            <p>Clubs</p>
          </div>
        </div>
        <div id="main-container" data-home>
          {tab ? <Client countries={countries} /> : <Club countries={countries} />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
