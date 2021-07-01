const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = `postgresql://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const prodConfig = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.NODE_ENV === "production" ? prodConfig : devConfig,
  ssl: true,
});

// pool.connect();

module.exports = pool;
