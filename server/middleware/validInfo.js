module.exports = (req, res, next) => {
  const { name, email, password, country } = req.body;

  function validEmail(centerEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(centerEmail);
  }

  if (req.path === "/centers/register") {
    console.log(!email.length);
    if (![email, name, password, country].every(Boolean)) {
      return res.status(401).json("Missing Credentials"); //ako ne ide probaj maknut sve ".status(401)"
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/centers/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};
