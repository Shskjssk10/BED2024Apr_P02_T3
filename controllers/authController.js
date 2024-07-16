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
  const { fname, lname, username, phone_number, gender, bio } = req.body;
  const email = req.query.email; // Get email from URL parameters
  console.log("Starting volunteer sign-up with Google");
  console.log("Request body:", req.body);

  try {
    await googleSignupVolunteer({
      fname,
      lname,
      username,
      email,
      phone_number,
      gender,
      bio,
    });
    res.status(201).json({ message: "Volunteer created successfully", email });
  } catch (error) {
    console.error("Error during Google volunteer sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleSignupOrganisationController = async (req, res) => {
  const {
    org_name,
    phone_number,
    issue_area,
    mission,
    description,
    address,
    apt_floor_unit,
    website,
  } = req.body;
  const email = req.query.email; // Get email from URL parameters
  console.log("Starting organisation sign-up with Google");
  console.log("Request body:", req.body);

  try {
    await googleSignupOrganisation({
      org_name,
      email,
      phone_number,
      issue_area,
      mission,
      description,
      address,
      apt_floor_unit,
      website,
    });
    res.status(201).json({ message: "Organisation created successfully", email });
  } catch (error) {
    console.error("Error during Google organisation sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
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
