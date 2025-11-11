const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const view = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    // validate the input
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    const user = req.user;

    // update the user
    await User.updateById(req.body, user.id);

    res.status(200).json({
      success: true,
      message: "Update Successful!",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const reset = async (req, res) => {
  try {
    const { oldPassword: password, newPassword } = req.body;
    const user = req.user;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Old password doesn't match!");
    }

    // encrypt the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // update user
    await User.updateById({ password: passwordHash }, user.id);

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(200).json({
      success: true,
      message: "Password has been updated successfully. Please Login Again",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  view,
  update,
  reset,
};
