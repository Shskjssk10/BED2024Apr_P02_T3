const express = require("express");
const router = express.Router();
const {
  authUser,
  authOrganisation,
} = require("../controllers/authController.js");

router.post("/login/user", authUser);
router.post("/login/organisation", authOrganisation);

module.exports = router;
