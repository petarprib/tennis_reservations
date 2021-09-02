const { Pool } = require("pg");
require("dotenv").config();

const devConfig = `postgresql://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const prodConfig = process.env.DATABASE_URL;

const pool = new Pool(
  process.env.NODE_ENV === "production"
    ? { connectionString: prodConfig, ssl: { rejectUnauthorized: false } }
    : { connectionString: devConfig }
);

module.exports = pool;
