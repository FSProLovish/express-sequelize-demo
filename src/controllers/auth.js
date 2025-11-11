const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { getJWT } = require("../utils/jwt");

// signup API controller
const signup = async (req, res) => {
  try {
    // validate req body
    validateSignUpData(req);

    // request body
    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // save in db
    await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    res.status(201).json({
      success: true,
      message: "User is created successfully!",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// login API controller
const login = async (req, res) => {
  try {
    // request body
    const { emailId, password } = req.body;

    // find the user using emailId
    const user = await User.findByEmail(emailId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Invalid Credentials!",
      });
    } else {
      // validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // create a JWT token
        const token = await getJWT(user.emailId);

        // add the token to the cookie
        res.cookie("token", token);

        res.status(200).json({
          success: true,
          message: "Login Successful!",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid Credentials!",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// logout API controller
const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Logout Successful!",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
