const sql = require("mssql");
const { poolPromise } = require("../../dbConfig");
const crypto = require("crypto");

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

const getUserByEmail = async (email) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        "SELECT id, fname, lname, email, hashedPassword, salt FROM Users WHERE email = @email"
      );

    if (result.recordset.length === 0) {
      console.log(`No user found with email ${email}`);
      return null;
    }

    const user = result.recordset[0];
    console.log(`User found with email ${user.email}`);
    return user;
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw error;
  }
};

const getOrganisationByEmail = async (email) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        "SELECT id, org_name, email, hashedPassword, salt FROM Organisations WHERE email = @email"
      );

    if (result.recordset.length === 0) {
      console.log(`No organization found with email ${email}`);
      return null;
    }

    const organisation = result.recordset[0];
    console.log(`Organization found with email ${organisation.email}`);
    return organisation;
  } catch (error) {
    console.error("Error retrieving organization from database:", error);
    throw error;
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const hashedPassword = hashPassword(password, user.salt);
    console.log(`Hashed password for user ${email}: ${hashedPassword}`);

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

const authOrganisation = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organisation = await getOrganisationByEmail(email);
    if (!organisation) {
      console.log(`Organization with email ${email} not found`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const hashedPassword = hashPassword(password, organisation.salt);
    console.log(`Hashed password for organization ${email}: ${hashedPassword}`);

    if (hashedPassword !== organisation.hashedPassword) {
      console.log(`Incorrect password for organization with email ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Passwords match, authentication successful
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

module.exports = {
  authUser,
  getUserByEmail,
  authOrganisation,
  getOrganisationByEmail,
};
