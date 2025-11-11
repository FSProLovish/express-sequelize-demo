const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const { requests, connections } = require("../controllers/user");

// GET - user pending connections
router.get("/requests/received", userAuth, requests);

// GET - user connections
router.get("/connections", userAuth, connections);

module.exports = router;
