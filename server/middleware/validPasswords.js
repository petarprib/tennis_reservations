const pool = require("../db");
const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
  const { newPassword, repNewPassword, currentPassword } = req.body;
  let errors = [];

  const validNewPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(newPassword);
  if (!validNewPassword) errors.push("newPassword");

  const validRepPassword = newPassword === repNewPassword;
  if (!validRepPassword) errors.push("repNewPassword");

  let account = await pool.query("SELECT password FROM account WHERE id = $1", [req.session.accountId]);
  const validCurrentPassword = await bcrypt.compare(currentPassword, account.rows[0].password);
  if (!validCurrentPassword) errors.push("currentPassword");

  errors.length > 0 ? res.json(errors) : next();
};
