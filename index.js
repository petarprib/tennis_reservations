const express = require("express");
const app = express();
const session = require("express-session");
const Redis = require("ioredis");
const redis = new Redis();
const RedisStore = require("connect-redis")(session);
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
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

app.use("/api/access", require("./routes/access"));

app.use("/api/dashboard", require("./routes/dashboard"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).send("Server Error");
});

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
