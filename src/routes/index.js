const express = require("express");
const router = express.Router();

// import all route files
const authRoutes = require("./auth");
const userRoutes = require("./user");
const profileRoutes = require("./profile");
const requestRoutes = require("./request");

// mount all routes
router.use("/", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/request", requestRoutes);

module.exports = router;
