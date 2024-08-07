const sql = require("mssql");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token.js");
const {
  comparePassword,
  getAccountByEmail,
  getVolunteerByAccountId,
  getOrganisationByAccountId,
  createVolunteer,
  createOrganisation,
  googleSignupVolunteer,
  googleSignupOrganisation,
} = require("../models/authModel");

const authAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await getAccountByEmail(email);
    if (!account) {
      console.log(`Account with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const volunteer = await getVolunteerByAccountId(account.AccID);
    const organisation = await getOrganisationByAccountId(account.AccID);

    if (volunteer) {
      const passwordMatch = await comparePassword(
        password,
        volunteer.HashedPassword
      );
      console.log(
        `Password comparison result for volunteer ${email}: ${passwordMatch}`
      );
      console.log(`Stored hashed password: ${volunteer.HashedPassword}`);
      if (!passwordMatch) {
        console.log(`Incorrect password for volunteer with email ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log(`Volunteer ${email} authenticated successfully`);
      return res.json({
        id: account.AccID,
        email: account.Email,
        token: generateToken(account.AccID),
      });
    }

    if (organisation) {
      const passwordMatch = await comparePassword(
        password,
        organisation.HashedPassword
      );
      console.log(
        `Password comparison result for organisation ${email}: ${passwordMatch}`
      );
      console.log(`Stored hashed password: ${organisation.HashedPassword}`);
      if (!passwordMatch) {
        console.log(`Incorrect password for organisation with email ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log(`Organisation ${email} authenticated successfully`);
      return res.json({
        id: account.AccID,
        email: account.Email,
        token: generateToken(account.AccID),
      });
    }

    console.log(
      `No volunteer or organisation found for account with email ${email}`
    );
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Error authenticating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkGoogleAccount = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await getAccountByEmail(email);
    if (account) {
      const token = generateToken(account.AccID);
      return res.json({
        exists: true,
        id: account.AccID,
        email: account.Email,
        token,
      });
    } else {
      return res.status(404).json({
        exists: false,
        message: "Account not found. Please complete the registration form.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleSignupVolunteerController = async (req, res) => {
  const {
    fname,
    lname,
    username,
    email,
    phone_number,
    gender,
    bio,
    mediapath,
  } = req.body;

  // Perform validations
  if (username.length > 15) {
    return res
      .status(400)
      .json({ message: "Username must be 15 characters or less." });
  } else if (fname.length > 20 || lname.length > 20) {
    return res
      .status(400)
      .json({ message: "First and last name must be 20 characters or less." });
  } else if (bio.length > 150) {
    return res
      .status(400)
      .json({ message: "Bio must be 150 characters or less." });
  } else if (phone_number.length > 8) {
    return res.status(400).json({
      message: "Phone number must be 8 digits Singaporean phone number.",
    });
  }

  try {
    const result = await googleSignupVolunteer(req.body);
    const token = generateToken(result.AccID);
    res.status(201).json({
      message: "Volunteer created successfully",
      email: result.email,
      token,
    });
  } catch (error) {
    console.error("Error during Google volunteer sign-up:", error);
    res.status(400).json({ message: error.message });
  }
};


const googleSignupOrganisationController = async (req, res) => {
  const {
    org_name,
    email,
    phone_number,
    issue_area,
    mission,
    description,
    address,
    apt_floor_unit,
    website,
    mediapath,
  } = req.body;

  // Perform validations
  if (org_name.length > 15) {
    return res
      .status(400)
      .json({ message: "Organisation name must be 15 characters or less." });
  } else if (phone_number.length > 8) {
    return res
      .status(400)
      .json({
        message: "Phone number must be 8 digits Singaporean phone number.",
      });
  } else if (org_name.length > 20) {
    return res
      .status(400)
      .json({ message: "Organisation name must be 20 characters or less." });
  } else if (issue_area.length > 50) {
    return res
      .status(400)
      .json({ message: "Issue area must be 50 characters or less." });
  } else if (mission.length > 255) {
    return res
      .status(400)
      .json({ message: "Mission must be 255 characters or less." });
  } else if (address.length > 255) {
    return res
      .status(400)
      .json({ message: "Address must be 255 characters or less." });
  } else if (apt_floor_unit.length > 50) {
    return res
      .status(400)
      .json({ message: "Apt/Floor/Unit must be 50 characters or less." });
  } else if (website.length > 255) {
    return res
      .status(400)
      .json({ message: "Website must be 255 characters or less." });
  }

  try {
    const result = await googleSignupOrganisation(req.body);
    const token = generateToken(result.AccID);
    res.status(201).json({
      message: "Organisation created successfully",
      email: result.email,
      token
    });
  } catch (error) {
    console.error("Error during Google organisation sign-up:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  authAccount,
  createVolunteer,
  createOrganisation,
  checkGoogleAccount,
  googleSignupOrganisationController,
  googleSignupVolunteerController,
};