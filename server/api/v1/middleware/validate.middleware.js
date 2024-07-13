const validator = require("validator");

const validateRegister = (req, res, next) => {
  const { lastname, firstname, school, email, username, password } = req.body;

  // Check for empty fields
  if (!lastname || !firstname || !school || !email || !username || !password) {
    return res.status(400).json({
      code: 400,
      message: "All fields are required",
    });
  }

  // Check email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid email format",
    });
  }

  // Check username length
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      code: 400,
      message: "Username must be between 3 and 20 characters",
    });
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: "Password must be at least 6 characters",
    });
  }

  // Check for valid URL in avatar
  // if (!validator.isURL(avatar)) {
  //   return res.status(400).json({
  //     code: 400,
  //     message: "Invalid URL format for avatar",
  //   });
  // }

  next();
};

module.exports = validateRegister;
