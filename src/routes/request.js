const express = require("express");

const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { send, review } = require("../controllers/request");

// POST - send connection request
router.post("/send/:status/:toUserId", userAuth, send);

// POST - review connection request
router.post("/review/:status/:requestId", userAuth, review);

module.exports = router;
