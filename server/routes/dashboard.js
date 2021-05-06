const router = require("express").Router();
const pool = require("../db");

router.get("/clubs", async (req, res) => {
  try {
    const user = await pool.query("SELECT name, type FROM account WHERE id = $1", [req.session.accountId]);

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

module.exports = router;
