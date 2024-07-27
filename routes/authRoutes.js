const express = require("express");
const router = express.Router();
const {
  authAccount,
  createVolunteer,
  createOrganisation,
  checkGoogleAccount,
  googleSignupVolunteerController,
  googleSignupOrganisationController,
} = require("../controllers/authController.js");

const { verifyToken } = require("../middlewares/authMiddleware.js");
const {
  getOrganisationListings,
} = require("../controllers/listingController.js");

router.post("/login", authAccount);
router.post("/signup/volunteer", createVolunteer);
router.post("/signup/organisation", createOrganisation);
router.post("/signup/google-volunteer", googleSignupVolunteerController);
router.post("/signup/google-organisation", googleSignupOrganisationController);
router.post("/check-google-account", checkGoogleAccount);
router.get("/listings", verifyToken, getOrganisationListings);

module.exports = router;
