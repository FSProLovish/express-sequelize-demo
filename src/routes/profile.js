const express = require("express");
const router = express.Router();
const { view, update, reset } = require("../controllers/profile");
const { userAuth } = require("../middlewares/auth");

// GET - user profile
router.get("/view", userAuth, view);

// PATCH - update user profile
router.patch("/edit", userAuth, update);

// PATCH - reset user password
router.patch("/password", userAuth, reset);

module.exports = router;
