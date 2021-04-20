module.exports = (req, res, next) => {
  const { name, email, password } = req.body;

  function validEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  if (req.path === "/") {
  } else if (req.path === "/register") {
  } else if (req.path === "/club-login") {
  } else if (req.path === "/club-register") {
  }

  if (req.path === "/register" || req.path === "/club-register") {
    if (![name, email, password].every(Boolean)) {
      return res.status(401).json("Missing credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid email");
    }
  } else if (req.path === "/login" || req.path === "/club-login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid email");
    }
  }

  next();
};
