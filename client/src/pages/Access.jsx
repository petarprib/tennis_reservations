import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../components/Access/styles/access.scoped.scss";
import fetchCountriesUtil from "../utils/fetchCountriesUtil";
import ClubLogin from "../components/Access/Club/ClubLogin.jsx";
import ClubRegister from "../components/Access/Club/ClubRegister.jsx";
import PlayerLogin from "../components/Access/Player/PlayerLogin.jsx";
import PlayerRegister from "../components/Access/Player/PlayerRegister.jsx";

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
