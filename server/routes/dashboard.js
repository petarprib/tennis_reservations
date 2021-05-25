const router = require("express").Router();
const pool = require("../db");

router.get("/session", async (req, res) => {
  try {
    const basicInfo = await pool.query("SELECT name FROM account WHERE id = $1", [req.session.accountId]);

    const { accountId, accountType, club } = req.session;

    res.json({ accountId, accountType, club, ...basicInfo.rows[0] });
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
  try {
    const courts = await pool.query(
      "SELECT court.id, number, club, court_type.id AS type_id, court_type.type FROM court INNER JOIN court_type ON court.type = court_type.id WHERE club = $1 ORDER BY number ASC",
      [req.session.club]
    );

    res.json(courts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.post("/courts", async (req, res) => {
  try {
    const { courtType, courtNumber } = req.body;

    const courts = await pool.query("SELECT number FROM court WHERE number = $1 AND club = $2", [
      courtNumber,
      req.session.accountId,
    ]);

    if (courts.rows.length) {
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

router.delete("/courts", async (req, res) => {
  try {
    const { court } = req.body;

    await pool.query("DELETE FROM court WHERE id = $1 AND club = $2", [court, req.session.accountId]);

    await pool.query("DELETE FROM reservation WHERE court = $1", [court]);

    res.end();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/courts", async (req, res) => {
  try {
    const courts = await pool.query(
      "SELECT court.id, number, club, court_type.id AS type_id, court_type.type FROM court INNER JOIN court_type ON court.type = court_type.id WHERE club = $1 ORDER BY number ASC",
      [req.session.club]
    );

    res.json(courts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/courts", async (req, res) => {
  try {
    const { courtId, courtNumber, courtType } = req.body;

    await pool.query("UPDATE court SET number = $1, type = $2 WHERE id = $3", [courtNumber, courtType, courtId]);

    res.end();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/reservations", async (req, res) => {
  try {
    const reservations = await pool.query("SELECT * FROM reservation ORDER BY start_time ASC");

    res.json(reservations.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.post("/reservations", async (req, res) => {
  try {
    const { club, court, startTime, endTime } = req.body;

    const reservation = await pool.query("SELECT * FROM reservation WHERE court = $1 AND start_time = $2", [
      court,
      startTime,
    ]);

    if (!reservation.rows.length) {
      await pool.query(
        "INSERT INTO reservation (club, court, player, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [club, court, req.session.accountId, startTime, endTime]
      );

      res.end();
    } else {
      if (req.session.accountType === 2) {
        await pool.query("DELETE FROM reservation WHERE club = $1 AND court = $2 AND start_time = $3", [
          req.session.accountId,
          court,
          startTime,
        ]);

        res.end();
      } else if (reservation.rows[0].player === req.session.accountId) {
        await pool.query("DELETE FROM reservation WHERE court = $1 AND player = $2 AND start_time = $3", [
          court,
          req.session.accountId,
          startTime,
        ]);

        res.end();
      } else {
        res.end();
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
