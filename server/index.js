const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const pool = require("./db");
const session = require("express-session");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // unset: "destroy",
    cookie: {
      httpOnly: true,
      secure: false, // false in development only
      sameSite: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
  })
);

// ROUTES;

app.use("/api/auth", require("./routes/auth"));

app.use("/api/dashboard", require("./routes/dashboard"));

//get all countries
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
    res.json(countries.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get clubs from a country
app.get("/api/clubs/:country", async (req, res) => {
  try {
    const { country } = req.params;
    const clubs = await pool.query(
      "SELECT id, name FROM account INNER JOIN club_details ON account.id = club_details.club_id WHERE country = $1 AND type = $2 ORDER BY name asc",
      [country, 2]
    );
    res.json(clubs.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// //create a user
// app.post("/api/players", async (req, res) => {
//   try {
//     const { name, email, password, club } = req.body;
//     const players = await pool.query(
//       "INSERT INTO player (name, email, password, club) VALUES ($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
//       [name, email, password, club]
//     );
//     res.json(players.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //create a club
// app.post("/api/clubs", async (req, res) => {
//   try {
//     const { country, name, email, password } = req.body;
//     const clubs = await pool.query(
//       "INSERT INTO club (name, email, password, country) VALUES ($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
//       [name, email, password, country]
//     );
//     res.json(clubs.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get all clubs
// app.get("/api/clubs", async (req, res) => {
//   try {
//     const clubs = await pool.query("SELECT * FROM club ORDER BY name asc");
//     res.json(clubs.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
