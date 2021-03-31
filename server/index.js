const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

// ROUTES

//create a user
app.post("/clients", async (req, res) => {
  try {
    const { name, email, password, center } = req.body;
    const clients = await pool.query(
      "INSERT INTO client (name, email, password, center) VALUES($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
      [name, email, password, center]
    );
    res.json(clients.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//create a club
app.post("/centers", async (req, res) => {
  try {
    const { country, name, email, password } = req.body;
    const centers = await pool.query(
      "INSERT INTO center (name, email, password, country) VALUES($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
      [name, email, password, country]
    );
    res.json(centers.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//get all countries
app.get("/countries", async (req, res) => {
  try {
    const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
    res.json(countries.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get all centers
app.get("/centers", async (req, res) => {
  try {
    const centers = await pool.query("SELECT * FROM center ORDER BY name asc");
    res.json(centers.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get centers from a country
app.get("/centers/:country", async (req, res) => {
  try {
    const { country } = req.params;
    const centers = await pool.query("SELECT * FROM center WHERE country = $1 ORDER BY name asc", [country]);
    res.json(centers.rows);
  } catch (error) {
    console.log(error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
