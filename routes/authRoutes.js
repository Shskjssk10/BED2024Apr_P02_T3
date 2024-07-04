const express = require("express");
const router = express.Router();
const {
  authAccount,
  createVolunteer,
  createOrganisation,
} = require("../controllers/authController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const {
  getOrganisationListings,
} = require("../controllers/listingController.js");

router.post("/login", authAccount);
router.post("/signup/volunteer", createVolunteer);
router.post("/signup/organisation", createOrganisation);
router.get("/listings", verifyToken, getOrganisationListings);

module.exports = router;
