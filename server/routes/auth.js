const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo");

// register
router.post("/register", validInfo, async (req, res) => {
  try {
    const { country, club, name, email, password, type } = req.body;

    if (type === 2) {
      const clubs = await pool.query("SELECT id FROM account WHERE email = $1 AND type = $2", [email, type]);

      if (clubs.rows.length) {
        return res.status(401).json(["club exists"]);
      }
    } else if (type === 3) {
      const players = await pool.query(
        "SELECT id FROM account INNER JOIN player_details ON account.id = player_details.player WHERE club = $1 AND email = $2 AND type = $3",
        [club, email, type]
      );

      if (players.rows.length) {
        return res.status(401).json(["player exists"]);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newAccount = await pool.query(
      "INSERT INTO account (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, type]
    );

    if (type === 2) {
      await pool.query(
        "INSERT INTO club_details (club, country, open_time, close_time, config_open_hours) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [newAccount.rows[0].id, country, "09:00", "21:00", false]
      );
    } else if (type === 3) {
      await pool.query("INSERT INTO player_details (player, club) VALUES ($1, $2) RETURNING *", [
        newAccount.rows[0].id,
        club,
      ]);
    }

    req.session.accountId = newAccount.rows[0].id;
    req.session.accountType = newAccount.rows[0].type;
    req.session.club = req.session.accountType === 2 ? req.session.accountId : club;

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// login
router.post("/login", validInfo, async (req, res) => {
  try {
    const { club, email, password, type } = req.body;

    let account = {};

    if (type === 2) {
      account = await pool.query("SELECT id, password, type FROM account WHERE email = $1 AND type = $2", [
        email,
        type,
      ]);
    } else if (type === 3) {
      account = await pool.query(
        "SELECT account.id, password, type FROM account INNER JOIN player_details ON account.id = player_details.player WHERE club = $1 AND email = $2 AND type = $3",
        [club, email, type]
      );
    }

    if (!account.rows.length) {
      return res.status(401).json(["login"]);
    }

    const validPassword = await bcrypt.compare(password, account.rows[0].password);

    if (!validPassword) {
      return res.status(401).json(["login"]);
    }

    req.session.accountId = account.rows[0].id;
    req.session.accountType = account.rows[0].type;
    req.session.club = req.session.accountType === 2 ? req.session.accountId : club;

    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// verify session
router.get("/verify", async (req, res) => {
  try {
    return res.json(req.session.accountId ? true : false);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// logout
router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    return res.json(req.session ? true : false);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
