const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
// const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
// const authorization = require("../middleware/authorization");

// //create a club
// app.post("/players", async (req, res) => {
//   try {
//     const { name, email, password, club } = req.body;
//     const players = await pool.query(
//       "INSERT INTO player (name, email, password, club) VALUES ($1, $2, crypt($3, gen_salt('bf', 4)), $4) RETURNING *",
//       [name, email, password, club]
//     );
//     res.json(players.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

//register club
router.post("/register", validInfo, async (req, res) => {
  try {
    const { country, club, name, email, password, type } = req.body;

    if (type === 2) {
      const clubs = await pool.query("SELECT * FROM account WHERE email = $1 AND type = $2", [email, type]);

      if (clubs.rows.length !== 0) {
        return res.status(401).json("Club already exists");
      }
    } else if (type === 3) {
      const players = await pool.query(
        "SELECT * FROM account INNER JOIN player_details ON account.id = player_details.player_id WHERE club = $1 AND email = $2 AND type = $3",
        [club, email, type]
      );

      if (players.rows.length !== 0) {
        return res.status(401).json("Player already exists");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newAccount = await pool.query(
      "INSERT INTO account (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, type]
    );

    if (type === 2) {
      await pool.query("INSERT INTO club_details (club_id, country) VALUES ($1, $2) RETURNING *", [
        newAccount.rows[0].id,
        country,
      ]);
    } else if (type === 3) {
      await pool.query("INSERT INTO player_details (player_id, club) VALUES ($1, $2) RETURNING *", [
        newAccount.rows[0].id,
        club,
      ]);
    }

    req.session.accountId = newAccount.rows[0].id;
    req.session.accountType = newAccount.rows[0].type;

    res.json(req.session.accountId !== "" ? true : false);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// login club
router.post("/login", validInfo, async (req, res) => {
  try {
    const { club, email, password, type } = req.body;

    // console.log(req.body);

    if (type === 3) {
      const player = await pool.query(
        "SELECT id, password, type FROM account INNER JOIN player_details ON account.id = player_details.player_id WHERE club = $1 AND email = $2 AND type = $3",
        [club, email, type]
      );

      // console.log(player);

      if (player.rows.length === 0) {
        return res.status(401).json("Incorrect login details");
      }

      const validPassword = await bcrypt.compare(password, player.rows[0].password);

      if (!validPassword) {
        return res.status(401).json("Incorrect login details");
      }

      req.session.accountId = player.rows[0].id;
      req.session.accountType = player.rows[0].type;

      res.json(req.session.accountId !== "" ? true : false);
    }

    // res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get(
  "/verify",
  //  authorization,
  async (req, res) => {
    try {
      res.json(req.session.accountId ? true : false);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.json(req.session ? true : false);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// //get all countries
// app.get("/countries", async (req, res) => {
//   try {
//     const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
//     res.json(countries.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get all clubs
// app.get("/clubs", async (req, res) => {
//   try {
//     const clubs = await pool.query("SELECT * FROM club ORDER BY name asc");
//     res.json(clubs.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// //get clubs from a country
// app.get("/:country", async (req, res) => {
//   try {
//     const { country } = req.params;
//     const clubs = await pool.query("SELECT * FROM club WHERE country = $1 ORDER BY name asc", [country]);
//     res.json(clubs.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

module.exports = router;
