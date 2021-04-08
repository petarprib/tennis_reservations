const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// //create a club
// app.post("/players", async (req, res) => {
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

//register club
router.post("/register", validInfo, async (req, res) => {
  try {
    const { country, name, email, password, type } = req.body;

    if (type === 2) {
      const club = await pool.query("SELECT * FROM account WHERE email = $1 AND type = $2", [email, type]);

      if (club.rows.length !== 0) {
        return res.status(401).json("club already exists");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newAccount = await pool.query(
      "INSERT INTO account (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, type]
    );

    if (type === 2) {
      await pool.query("INSERT INTO club_details (club, country) VALUES ($1, $2) RETURNING *", [
        newAccount.rows[0].id,
        country,
      ]);
    }

    const token = jwtGenerator(newAccount.rows[0].id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//login club
router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const club = await pool.query("SELECT * FROM club WHERE email = $1", [email]);

    if (club.rows.length === 0) {
      return res.status(401).json("Incorrect login details");
    }

    const validPassword = await bcrypt.compare(password, club.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Incorrect login details");
    }

    const token = jwtGenerator(club.rows[0].id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// //get all countries
// app.get("/countries", async (req, res) => {
//   try {
//     const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
//     res.json(countries.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get all clubs
// app.get("/clubs", async (req, res) => {
//   try {
//     const clubs = await pool.query("SELECT * FROM club ORDER BY name asc");
//     res.json(clubs.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get clubs from a country
// app.get("/:country", async (req, res) => {
//   try {
//     const { country } = req.params;
//     const clubs = await pool.query("SELECT * FROM club WHERE country = $1 ORDER BY name asc", [country]);
//     res.json(clubs.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

module.exports = router;
