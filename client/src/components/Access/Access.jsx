import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles/access.scoped.scss";
import fetchCountriesUtil from "../../utils/fetchCountriesUtil";
import ClubLogin from "./Club/ClubLogin.jsx";
import ClubRegister from "./Club/ClubRegister.jsx";
import PlayerLogin from "./Player/PlayerLogin.jsx";
import PlayerRegister from "./Player/PlayerRegister.jsx";

const Access = () => {
  const pathname = useLocation().pathname;
  const [access, setAccess] = useState();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    pathname === "/" && setAccess(<PlayerLogin countries={countries} />);
    pathname === "/register" && setAccess(<PlayerRegister countries={countries} />);
    pathname === "/club-login" && setAccess(<ClubLogin />);
    pathname === "/club-register" && setAccess(<ClubRegister countries={countries} />);
  }, [pathname, countries]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const countryList = await fetchCountriesUtil();
    setCountries(countryList);
  };

  return (
    <div id="background" data-access>
      <div id="form-container" data-access>
        {access}
      </div>
    </div>
  );
};

export default Access;
