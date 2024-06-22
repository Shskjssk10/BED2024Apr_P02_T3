const crypto = require("crypto");
const generateToken = require("../utils/token.js");
const {
  getUserByEmail,
  getOrganisationByEmail,
  createUser,
  createOrganisation,
} = require("../models/login.js");
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signUpUserSchema = Joi.object({
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
  org_phone_number: Joi.string().required(),
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
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const hashPassword = (password, salt) => {
      return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    };

    const hashedPassword = hashPassword(password, user.salt);
    console.log(`Hashed password for user ${email}: ${hashedPassword}`);

    if (hashedPassword !== user.hashedPassword) {
      console.log(`Incorrect password for user with email ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`User ${email} authenticated successfully`);
    res.json({
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authOrganisation = async (req, res) => {
  const { email, password } = req.body;

  console.log("Request received with email:", email, "and password:", password);

  // Validate input using Joi schema
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const organisation = await getOrganisationByEmail(email);
    if (!organisation) {
      console.log(`Organization with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const hashPassword = (password, salt) => {
      return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    };

    const hashedPassword = hashPassword(password, organisation.salt);
    console.log(`Hashed password for organization ${email}: ${hashedPassword}`);

    if (hashedPassword !== organisation.hashedPassword) {
      console.log(`Incorrect password for organization with email ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`Organization ${email} authenticated successfully`);
    res.json({
      id: organisation.id,
      org_name: organisation.org_name,
      email: organisation.email,
      token: generateToken(organisation.id),
    });
  } catch (error) {
    console.error("Error authenticating organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpUser = async (req, res) => {
  const userData = req.body;

  // Validate input using Joi schema
  const { error } = signUpUserSchema.validate(userData);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, salt, hashedPassword } = await createUser(userData);
    console.log(
      `New user created with email ${email}, salt ${salt}, and hashed password ${hashedPassword}`
    );
    res
      .status(201)
      .json({
        message: "User created successfully",
        email,
        salt,
        hashedPassword,
      });
  } catch (error) {
    console.error("Error creating user:", error);
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
    console.log(
      `New organization created with email ${email}, salt ${salt}, and hashed password ${hashedPassword}`
    );
    res
      .status(201)
      .json({
        message: "Organization created successfully",
        email,
        salt,
        hashedPassword,
      });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authUser, authOrganisation, signUpUser, signUpOrganisation };
