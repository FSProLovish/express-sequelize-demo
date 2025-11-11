const { verifyJWT } = require("../utils/jwt");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // get token from cookies
    const { token } = req.cookies || {};
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login!",
      });
    }

    // verify token
    const decodedObj = await verifyJWT(token);
    const { email: emailId } = decodedObj;

    // find the user using emailId
    const user = await User.findByEmail(emailId);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  userAuth,
};
