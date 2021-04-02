const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// //create a user
// app.post("/clients", async (req, res) => {
//   try {
//     const { name, email, password, center } = req.body;
//     const clients = await pool.query(
//       "INSERT INTO client (name, email, password, center) VALUES ($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
//       [name, email, password, center]
//     );
//     res.json(clients.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

//register center
router.post("/centers/register", validInfo, async (req, res) => {
  try {
    const { country, name, email, password } = req.body;

    const user = await pool.query("SELECT * FROM center WHERE email = $1", [email]);

    if (user.rows.length !== 0) {
      return res.status(401).json("Center already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newCenter = await pool.query(
      "INSERT INTO center (name, email, password, country) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, country]
    );

    const token = jwtGenerator(newCenter.rows[0].id);
    console.log(token);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//login center
router.post("/centers/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const center = await pool.query("SELECT * FROM center WHERE email = $1", [email]);

    if (center.rows.length === 0) {
      return res.status(401).json("Incorrect login details");
    }

    const validPassword = await bcrypt.compare(password, center.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Incorrect login details");
    }

    const token = jwtGenerator(center.rows[0].id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/centers/is-verify", authorization, async (req, res) => {
  //if it doesn't work with /centers, remove it
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

// //get all centers
// app.get("/centers", async (req, res) => {
//   try {
//     const centers = await pool.query("SELECT * FROM center ORDER BY name asc");
//     res.json(centers.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get centers from a country
// app.get("/centers/:country", async (req, res) => {
//   try {
//     const { country } = req.params;
//     const centers = await pool.query("SELECT * FROM center WHERE country = $1 ORDER BY name asc", [country]);
//     res.json(centers.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

module.exports = router;
