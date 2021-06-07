const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validPasswords = require("../middleware/validPasswords");

// get whether opening and closing times have been determined
router.get("/initial-club-config", async (req, res) => {
  try {
    const openHoursConfiguration = await pool.query(
      "SELECT open_time, close_time, config_open_hours FROM club_details WHERE club = $1",
      [req.session.club]
    );

    const { open_time, close_time, config_open_hours } = openHoursConfiguration.rows[0];

    return res.json({ open_time, close_time, config_open_hours });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// set opening and closing times
router.put("/initial-club-config", async (req, res) => {
  try {
    const { formatOpenTime, formatCloseTime } = req.body;

    await pool.query(
      "UPDATE club_details SET open_time = $1, close_time = $2, config_open_hours = $3 WHERE club = $4",
      [formatOpenTime, formatCloseTime, true, req.session.club]
    );

    res.end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// get opening and closing times
router.get("/open-hours", async (req, res) => {
  try {
    const openHours = await pool.query("SELECT open_time, close_time FROM club_details WHERE club = $1", [
      req.session.club,
    ]);

    return res.json(openHours.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// get basic user info
router.get("/session", async (req, res) => {
  try {
    console.log(req.session);
    const basicInfo = await pool.query("SELECT name FROM account WHERE id = $1", [req.session.accountId]);

    const { accountId, accountType, club } = req.session;

    return res.json({ accountId, accountType, club, ...basicInfo.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// change user name
router.put("/accounts/name", async (req, res) => {
  try {
    const { newName } = req.body;

    if (!newName) {
      return res.json("The name can't be empty");
    }
    if (req.session.accountType === 3 && !newName.includes(" ")) {
      return res.json("Name must include both name and surname");
    }

    await pool.query("UPDATE account SET name = $1 WHERE id = $2", [newName, req.session.accountId]);

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// change user email
router.put("/accounts/email", async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (req.session.accountType === 2) {
      const clubs = await pool.query("SELECT id FROM account WHERE email = $1 AND type = $2 AND id != $3", [
        newEmail,
        req.session.accountType,
        req.session.accountId,
      ]);

      if (clubs.rows.length) {
        return res.json("Email is already taken");
      }
    } else if (req.session.accountType === 3) {
      const players = await pool.query(
        "SELECT id FROM account INNER JOIN player_details ON account.id = player_details.player WHERE club = $1 AND email = $2 AND type = $3 AND id != $4",
        [club, newEmail, req.session.accountType, req.session.accountId]
      );

      if (players.rows.length) {
        return res.json("Email is already taken");
      }
    }

    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmail);

    if (!validEmail) return res.json("Invalid email");

    await pool.query("UPDATE account SET email = $1 WHERE id = $2", [newEmail, req.session.accountId]);

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// change user password
router.put("/accounts/password", validPasswords, async (req, res) => {
  try {
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE account SET password = $1 WHERE id = $2", [bcryptPassword, req.session.accountId]);

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// get court types
router.get("/court-types", async (req, res) => {
  try {
    const courtTypes = await pool.query("SELECT id, type FROM court_type");

    return res.json(courtTypes.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// get courts
router.get("/courts", async (req, res) => {
  try {
    const courts = await pool.query(
      "SELECT court.id, number, club, court_type.id AS type_id, court_type.type FROM court INNER JOIN court_type ON court.type = court_type.id WHERE club = $1 ORDER BY number ASC",
      [req.session.club]
    );

    return res.json(courts.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// add court
router.post("/courts", async (req, res) => {
  try {
    const { courtType, courtNumber } = req.body;

    const courts = await pool.query("SELECT number FROM court WHERE number = $1 AND club = $2", [
      courtNumber,
      req.session.club,
    ]);

    if (courts.rows.length) {
      return res.json("You already have a court with that number");
    }

    const newCourt = await pool.query("INSERT INTO court (type, number, club) VALUES ($1, $2, $3) RETURNING *", [
      courtType,
      courtNumber,
      req.session.club,
    ]);

    return res.json(newCourt.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// delete court
router.delete("/courts", async (req, res) => {
  try {
    const { court } = req.body;

    await pool.query("DELETE FROM court WHERE id = $1 AND club = $2", [court, req.session.club]);

    await pool.query("DELETE FROM reservation WHERE court = $1", [court]);

    res.end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// edit court
router.put("/courts", async (req, res) => {
  try {
    const { courtId, courtNumber, courtType } = req.body;

    const court = await pool.query("SELECT number FROM court WHERE id != $1 AND number = $2 AND club = $3", [
      courtId,
      courtNumber,
      req.session.club,
    ]);

    if (court.rows.length) {
      return res.json("You already have a court with that number");
    }

    await pool.query("UPDATE court SET number = $1, type = $2 WHERE id = $3", [courtNumber, courtType, courtId]);

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// get reservations
router.get("/reservations", async (req, res) => {
  try {
    const reservations = await pool.query(
      "SELECT reservation.*, account.email, account.name FROM reservation INNER JOIN account ON reservation.player = account.id ORDER BY start_time ASC"
    );

    return res.json(reservations.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// add reservation
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
    } else if (reservation.rows[0].player === req.session.accountId) {
      await pool.query("DELETE FROM reservation WHERE court = $1 AND start_time = $2", [court, startTime]);

      res.end();
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// deletes player reservation
router.delete("/reservations", async (req, res) => {
  try {
    const { court, startTime } = req.body;

    await pool.query("DELETE FROM reservation WHERE club = $1 AND court = $2 AND start_time = $3", [
      req.session.accountId,
      court,
      startTime,
    ]);

    res.end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
