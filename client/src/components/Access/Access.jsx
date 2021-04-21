import React, { useState, useEffect } from "react";
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
      const res = await fetch("/api/countries");
      const data = await res.json();
      let countries = [];
      data.forEach((country) =>
        countries.push({
          value: country.name,
          label: country.name,
          id: country.id,
        })
      );
      setCountries(countries);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div id="background" data-home>
      <div id="form-container" data-home>
        {access}
      </div>
    </div>
  );
};

export default Access;
