import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import "./access.scoped.scss";
import ClubLogin from "./Club/ClubLogin.jsx";
import ClubRegister from "./Club/ClubRegister.jsx";
import PlayerLogin from "./Player/PlayerLogin.jsx";
import PlayerRegister from "./Player/PlayerRegister.jsx";

const Access = () => {
  const pathname = useLocation().pathname;
  const [access, setAccess] = useState();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (pathname === "/") setAccess(<PlayerLogin countries={countries} />);
    else if (pathname === "/register") setAccess(<PlayerRegister countries={countries} />);
    else if (pathname === "/club-login") setAccess(<ClubLogin />);
    else if (pathname === "/club-register") setAccess(<ClubRegister countries={countries} />);
  }, [pathname, countries]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/countries");
      const data = await res.json();
      let countries = [];
      data.forEach((country) =>
        countries.push({
          value: country.name
            .split(" ")
            .join("_")
            .toLowerCase(),
          label: country.name,
          id: country.id,
        })
      );
      setCountries(countries);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div id="background" data-home />
      <div id="main-container" data-home>
        {access}
      </div>
    </>
  );
};

export default Access;
