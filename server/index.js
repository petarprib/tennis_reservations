const express = require("express");
const app = express();
const session = require("express-session");
const Redis = require("ioredis");
const redis = new Redis();
const RedisStore = require("connect-redis")(session);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false, // false in development only
      sameSite: true,
      maxAge: parseInt(process.env.SESSION_IDLE_TIMEOUT),
    },
    store: new RedisStore({ client: redis }),
    name: process.env.SESSION_NAME,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    unset: "destroy",
  })
);

app.use("/api/auth", require("./routes/auth"));

app.use("/api/dashboard", require("./routes/dashboard"));

//get countries
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await pool.query("SELECT * FROM country ORDER BY name asc");
    return res.json(countries.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get clubs from a country
app.get("/api/clubs/:country", async (req, res) => {
  try {
    const { country } = req.params;
    const clubs = await pool.query(
      "SELECT account.id, name, country FROM account INNER JOIN club_details ON account.id = club_details.club WHERE country = $1 AND type = $2 ORDER BY name asc",
      [country, 2]
    );
    return res.json(clubs.rows);
  } catch (error) {
    console.error(error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
