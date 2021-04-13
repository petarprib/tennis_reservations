const router = require("express").Router();
const pool = require("../db");
// const authorization = require("../middleware/authorization");

router.get("/clubs", authorization, async (req, res) => {
  try {
    // req.club has the payload
    // res.json(req.club);

    const club = await pool.query("SELECT name FROM account WHERE id = $1", [req.account]);

    res.json(club.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
