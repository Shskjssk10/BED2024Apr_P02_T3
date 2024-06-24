const { createVolunteer, createOrganisation, authAccount } = require("../models/login.js");
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signUpVolunteerSchema = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  gender: Joi.string().required(),
  bio: Joi.string().required(),
  password: Joi.string().required(),
});

const signUpOrganisationSchema = Joi.object({
  org_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
  issue_area: Joi.string().required(),
  mission: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.string().required(),
  apt_floor_unit: Joi.string().required(),
});

const authUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Request received with email:", email, "and password:", password);

  // Validate input using Joi schema
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    await authAccount(req, res);
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpVolunteer = async (req, res) => {
  const volunteerData = req.body;

  // Validate input using Joi schema
  const { error } = signUpVolunteerSchema.validate(volunteerData);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, salt, hashedPassword } = await createVolunteer(volunteerData);
    console.log(`New volunteer created with email ${email}, salt ${salt}, and hashed password ${hashedPassword}`);
    res.status(201).json({ message: "Volunteer created successfully", email, salt, hashedPassword });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpOrganisation = async (req, res) => {
  const orgData = req.body;

  // Validate input using Joi schema
  const { error } = signUpOrganisationSchema.validate(orgData);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, salt, hashedPassword } = await createOrganisation(orgData);
    console.log(`New organisation created with email ${email}, salt ${salt}, and hashed password ${hashedPassword}`);
    res.status(201).json({ message: "Organisation created successfully", email, salt, hashedPassword });
  } catch (error) {
    console.error("Error creating organisation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authUser, signUpVolunteer, signUpOrganisation };
