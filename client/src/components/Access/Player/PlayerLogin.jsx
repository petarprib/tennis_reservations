import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ".././access.scoped.scss";
import Select from "react-select";

const PlayerLogin = (props) => {
  const [countries, setCountries] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    setCountries(props.countries);
  }, [props.countries]);

  const fetchClubs = async (e) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${e.id}`);
      const data = await res.json();
      let clubs = [];
      data.forEach((club) =>
        clubs.push({
          value: club.name
            .split(" ")
            .join("_")
            .toLowerCase(),
          label: club.name,
          id: club.id,
        })
      );
      setClubs(clubs);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      <h1>Player Login</h1>
      <div className="options" data-home>
        <Link to="/club-login">Access as club</Link>
      </div>
      <form id="form" onSubmit={(e) => handleSubmit(e)} data-home>
        <Select
          classNamePrefix="form-dropdown"
          options={countries}
          placeholder="First select the country"
          onChange={(e) => fetchClubs(e)}
          data-home
        />
        <Select
          classNamePrefix="form-dropdown"
          options={clubs}
          placeholder="...and now the club"
          // onChange={(e) => setClub(e.id)}
          data-home
        />
        <input
          className="form-input"
          type="text"
          placeholder="Email"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          data-home
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          data-home
        />
        <button>Log in</button>
      </form>
      <div className="options" data-home>
        <Link to="/register">New here? Register</Link>
      </div>
    </>
  );
};

export default PlayerLogin;
