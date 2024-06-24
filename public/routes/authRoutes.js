const express = require("express");
const router = express.Router();
const {
  authUser,
  signUpVolunteer,
  signUpOrganisation,
} = require("../controllers/authController.js");
const {
  getOrganisationListings,
} = require("../controllers/listingController.js"); // Ensure correct import
const { verifyToken } = require("../middlewares/authMiddleware.js"); // Ensure correct import

router.post("/login", authUser);
router.post("/signup/volunteer", signUpVolunteer);
router.post("/signup/organisation", signUpOrganisation);
router.get("/listings", verifyToken, getOrganisationListings); // Correct route definition

module.exports = router;
