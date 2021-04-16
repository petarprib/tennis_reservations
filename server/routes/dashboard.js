const router = require("express").Router();
const pool = require("../db");
// const authorization = require("../middleware/authorization");

router.get(
  "/clubs",
  // authorization,
  async (req, res) => {
    try {
      // req.club has the payload
      // res.json(req.club);

      const whatever = await pool.query("SELECT name, type FROM account WHERE id = $1", [req.session.accountId]);

      res.json(whatever.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
