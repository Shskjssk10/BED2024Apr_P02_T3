const express = require("express");
const router = express.Router();
const { authUser, authOrganisation } = require("../controllers/authController.js");

router.post("/login/user", authUser);

module.exports = router;
