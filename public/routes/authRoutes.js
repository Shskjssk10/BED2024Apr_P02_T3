const express = require("express");
const router = express.Router();
const {
  authUser,
  authOrganisation,
  signUpUser,
  signUpOrganisation,
} = require("../controllers/authController.js");

router.post("/login/user", authUser);
router.post("/login/organisation", authOrganisation);
router.post("/signup/user", signUpUser);
router.post("/signup/organisation", signUpOrganisation);

module.exports = router;
