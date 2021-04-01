const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(id) {
  const payload = {
    center: id,
  };
  //  OR
  //   const payload = {
  //     center: {
  //       id: id
  //     }
  //   }; // (need to change in authorization too then)

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
