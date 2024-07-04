const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token.js");

const saltRounds = 10;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { salt, hashedPassword };
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const getAccountByEmail = async (email) => {
  try {
    const connection = await sql.connect(dbConfig);
    const accountSqlQuery = `SELECT * FROM Account WHERE Email = @email`;
    const request = connection.request();
    request.input("email", sql.VarChar, email);
    const result = await request.query(accountSqlQuery);
    if (result.recordset.length === 0) {
      console.log(`No account found with email ${email}`);
      return null;
    }

    const account = result.recordset[0];
    console.log(`Account found with email ${account.Email}`);
    return account;
  } catch (error) {
    console.error("Error retrieving account from database:", error);
    throw error;
  }
};

const getVolunteerByAccountId = async (accountId) => {
  try {
    const connection = await sql.connect(dbConfig);
    const accountSqlQuery = `SELECT * FROM Volunteer WHERE AccID = @accId`;
    const request = connection.request();
    request.input("accId", sql.SmallInt, accountId);
    const result = await request.query(accountSqlQuery);

    if (result.recordset.length === 0) {
      console.log(`No volunteer found with account ID ${accountId}`);
      return null;
    }

    const volunteer = result.recordset[0];
    console.log(`Volunteer found with account ID ${accountId}`);
    return volunteer;
  } catch (error) {
    console.error("Error retrieving volunteer from database:", error);
    throw error;
  }
};

const getOrganisationByAccountId = async (accountId) => {
  try {
    const connection = await sql.connect(dbConfig);
    const result = await connection.query`SELECT * FROM Organisation WHERE AccID = ${accountId}`;
    const request = connection.request();
    request.input("accId", sql.SmallInt, accountId);

    if (result.recordset.length === 0) {
      console.log(`No organisation found with account ID ${accountId}`);
      return null;
    }

    const organisation = result.recordset[0];
    console.log(`Organisation found with account ID ${accountId}`);
    return organisation;
  } catch (error) {
    console.error("Error retrieving organisation from database:", error);
    throw error;
  }
};

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

const createVolunteer = async (req, res) => {
  const { fname, lname, username, email, phone_number, gender, bio, password } =
    req.body;
  const { salt, hashedPassword } = await hashPassword(password);

  try {
    const connection = await sql.connect(dbConfig);
    const accountSqlQuery = `
        INSERT INTO Account (Username, PhoneNo, Email, Password)
        VALUES (@username, @phoneNo, @Email, @Password);
        SELECT SCOPE_IDENTITY() AS AccID;
      `;
    const request = connection.request();
    request.input("username", sql.VarChar, username);
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password); // Store plain password here
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;
    console.log(accId);
    const volunteerSqlQuery = `
        INSERT INTO Volunteer (AccID, FName, LName, Username, Gender, Bio, Salt, HashedPassword)
        VALUES (@accId, @fname, @lname, @username, @gender, @bio, @salt, @hashedPassword)
      `;
    const volunteerReq = connection.request();
    volunteerReq.input("accId", sql.SmallInt, accId);
    volunteerReq.input("fname", sql.VarChar, fname);
    volunteerReq.input("lname", sql.VarChar, lname);
    volunteerReq.input("username", sql.VarChar, username);
    volunteerReq.input("gender", sql.VarChar, gender);
    volunteerReq.input("bio", sql.VarChar, bio);
    volunteerReq.input("salt", sql.VarChar, salt);
    volunteerReq.input("hashedPassword", sql.VarChar, hashedPassword); // Store hashed password here

    await volunteerReq.query(volunteerSqlQuery);
    console.log(`Volunteer created with email ${email}`);
    res.status(201).json({ message: "Volunteer created successfully", email });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOrganisation = async (req, res) => {
  const {
    org_name,
    email,
    phone_number,
    password,
    issue_area,
    mission,
    description,
    address,
    apt_floor_unit,
  } = req.body;

  const { salt, hashedPassword } = await hashPassword(password);
  const username = org_name; // Set username to org_name

  try {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("username", sql.VarChar, username); // Use org_name as username
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, hashedPassword); // Use hashed password, not plain

    const accountSqlQuery = `
      INSERT INTO Account (Username, PhoneNo, Email, Password)
      VALUES (@username, @phoneNo, @Email, @Password);
      SELECT SCOPE_IDENTITY() AS AccID;
    `;
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;

    const organisationReq = connection.request(); // Correct variable name
    organisationReq.input("accId", sql.SmallInt, accId);
    organisationReq.input("orgName", sql.VarChar, org_name);
    organisationReq.input("issueArea", sql.VarChar, issue_area);
    organisationReq.input("mission", sql.VarChar, mission);
    organisationReq.input("description", sql.Text, description);
    organisationReq.input("address", sql.VarChar, address);
    organisationReq.input("aptFloorUnit", sql.VarChar, apt_floor_unit);
    organisationReq.input("salt", sql.VarChar, salt);
    organisationReq.input("hashedPassword", sql.VarChar, hashedPassword); // Use hashed password

    const organisationSqlQuery = `
      INSERT INTO Organisation (AccID, OrgName, IssueArea, Mission, Descr, Addr, AptFloorUnit, Salt, HashedPassword)
      VALUES (@accId, @orgName, @issueArea, @mission, @description, @address, @aptFloorUnit, @salt, @hashedPassword)
    `;
    await organisationReq.query(organisationSqlQuery);

    console.log(`Organisation created with email ${email}`);
    res
      .status(201)
      .json({ message: "Organisation created successfully", email });
  } catch (error) {
    console.error("Error creating organisation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authAccount, createVolunteer, createOrganisation };
