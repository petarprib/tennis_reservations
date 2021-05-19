const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");

// router.get("/clubs", async (req, res) => {
//   try {
//     const user = await pool.query(
//       "SELECT account.id, name, type, open_time, close_time, min_one_hour FROM account INNER JOIN club_details ON account.id = club_details.id WHERE account.id = $1",
//       [req.session.accountId]
//     );

//     res.json(user.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json("Server Error");
//   }
// });

router.get("/session", async (req, res) => {
  try {
    // const user = await pool.query("SELECT * FROM account WHERE account.id = $1", [req.session.accountId]);

    res.json(req.session);
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
  const courts = await pool.query(
    "SELECT court.id, court_type.type, number, club FROM court INNER JOIN court_type ON court.type = court_type.id WHERE club = $1 ORDER BY number ASC",
    [req.session.club]
  );

  res.json(courts.rows);
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
      const newReservation = await pool.query(
        "INSERT INTO reservation (club, court, player, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [club, court, req.session.accountId, startTime, endTime]
      );
      return res.json(newReservation.rows[0]);
    } else {
      if (req.session.accountType === 2) {
        const removedReservation = await pool.query(
          "DELETE FROM reservation WHERE club = $1 AND court = $2 AND start_time = $3",
          [req.session.accountId, court, startTime]
        );
        return res.json(removedReservation);
      } else if (reservation.rows[0].player === req.session.accountId) {
        const removedReservation = await pool.query(
          "DELETE FROM reservation WHERE court = $1 AND player = $2 AND start_time = $3",
          [court, req.session.accountId, startTime]
        );
        return res.json(removedReservation);
      } else {
        return;
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
