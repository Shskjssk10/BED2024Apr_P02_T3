const express = require("express");
const router = express.Router();
const { authUser, signUpVolunteer, signUpOrganisation } = require("../controllers/authController.js");

router.post("/login", authUser);
router.post("/signup/volunteer", signUpVolunteer);
router.post("/signup/organisation", signUpOrganisation);

module.exports = router;
