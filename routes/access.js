const router = require("express").Router();
const pool = require("../db");

// Get countries
router.get("/countries", async (req, res) => {
  try {
    const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
    return res.json(countries.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    return res.json(req.session ? true : false);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

// Get clubs from a country
router.get("/clubs/:country", async (req, res) => {
  try {
    const { country } = req.params;
    const clubs = await pool.query(
      "SELECT account.id, name, country FROM account INNER JOIN club_details ON account.id = club_details.club WHERE country = $1 AND type = $2 ORDER BY name asc",
      [country, 2]
    );
    return res.json(clubs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
