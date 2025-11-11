const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { chat } = require("../controllers/chat");

const router = express.Router();

router.get("/:targetUserId", userAuth, chat);

module.exports = router;
