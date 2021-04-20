module.exports = (req, res, next) => {
  const { country, club, name, email, password, repPassword, type } = req.body;
  let errors = [];

  const validEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  };

  if (req.path === "/login") {
    if (type === 2) {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("All fields are required");
      } else if (!validEmail(email)) {
        return res.status(401).json("email format");
      }
    } else if (type === 3) {
      if (![club, email, password].every(Boolean)) {
        return res.status(401).json("All fields are required");
      } else if (!validEmail(email)) {
        return res.status(401).json("email format");
      }
    }
  } else if (req.path === "/register") {
    if (type === 2) {
      if (!country) {
        errors.push("country");
      }
      if (!name) {
        errors.push("name");
      }
    } else if (type === 3) {
      if (!club) {
        errors.push("club");
      }
      if (!name || !name.includes(" ")) {
        errors.push("name");
      }
    }
    if (!email || !validEmail(email)) {
      errors.push("email");
    }
    if (!password || !validPassword(password)) {
      errors.push("password");
    }
    if (!repPassword || repPassword !== password) {
      errors.push("repPassword");
    }
  }

  errors.length > 0 ? res.status(401).json(errors) : next();
};
