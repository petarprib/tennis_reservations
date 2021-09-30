const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: `postgresql://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
});

module.exports = pool;
