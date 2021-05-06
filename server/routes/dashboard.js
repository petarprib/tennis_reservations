const router = require("express").Router();
const pool = require("../db");

router.get("/clubs", async (req, res) => {
  try {
    const user = await pool.query("SELECT id, name, type FROM account WHERE id = $1", [req.session.accountId]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.get("/court-types", async (req, res) => {
  try {
    const courtTypes = await pool.query("SELECT id, type FROM court_type");

    res.json(courtTypes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.get("/courts", async (req, res) => {
  const courts = await pool.query("SELECT id, type, number FROM court WHERE club = $1", [req.session.accountId]);

  res.json(courts.rows);
});

router.post("/courts", async (req, res) => {
  const { courtType, courtNumber } = req.body;

  try {
    const courts = await pool.query("SELECT number FROM court WHERE number = $1 AND club = $2", [
      courtNumber,
      req.session.accountId,
    ]);

    if (courts.rows.length !== 0) {
      return res.json("You already have a court with that number");
    }

    const newCourt = await pool.query("INSERT INTO court (type, number, club) VALUES ($1, $2, $3) RETURNING *", [
      courtType,
      courtNumber,
      req.session.accountId,
    ]);

    res.json(newCourt.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
