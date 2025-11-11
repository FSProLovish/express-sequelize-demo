const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/auth");
const { userAuth } = require("../middlewares/auth");

// POST - User `signup` API
router.post("/signup", signup);

// POST - User `login` API
router.post("/login", login);

// POST - User `logout` API
router.post("/logout", userAuth, logout);

module.exports = router;
