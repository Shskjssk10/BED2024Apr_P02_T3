const crypto = require("crypto");
const generateToken = require("../utils/token.js"); // Assuming token generation logic is in utils
const { getUserByEmail } = require("../models/login.js"); // Assuming models folder
const Joi = require("joi");
const db = require("../../dbConfig"); // Assuming database configuration

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const authUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input using Joi schema
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Retrieve user from the database by email
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log retrieved salt for debugging
    console.log("Retrieved salt:", user.salt);

    // Define the hashPassword function
    const hashPassword = (password, salt) => {
      return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    };

    // Hash the provided password with the retrieved salt
    const hashedPassword = hashPassword(password, user.salt);

    // Log generated hashed password for debugging
    console.log("Generated hashed password:", hashedPassword);

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== user.hashedPassword) {
      console.log(`Incorrect password for user with email ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Passwords match, authentication successful
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

module.exports = { authUser };
