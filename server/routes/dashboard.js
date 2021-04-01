const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    //req.center has the payload
    // res.json(req.center);

    const center = await pool.query("SELECT name FROM center WHERE id = $1", [req.center]);

    res.json(center.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
