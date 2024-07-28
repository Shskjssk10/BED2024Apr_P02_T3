const sql = require("mssql");
const dbConfig = require("../dbConfig.js");
const bcrypt = require("bcrypt");
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
    const result =
      await connection.query`SELECT * FROM Organisation WHERE AccID = ${accountId}`;
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

const createVolunteer = async (req, res) => {
  const {
    fname,
    lname,
    username,
    email,
    phone_number,
    gender,
    bio,
    password,
    mediapath,
  } = req.body;
  const { salt, hashedPassword } = await hashPassword(password);

  console.log(req.body);

  // check if google sign up
  const isGoogleSignUp = !password;

  const passwordRegex = /^(?=.*\d).{10,}$/; // At least 10 characters and at least one number

  // Validate input fields
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
  } else if (!isGoogleSignUp && email.length > 255) {
    return res
      .status(400)
      .json({ message: "Email must be 255 characters or less." });
  } else if (
    !isGoogleSignUp &&
    (password.length > 255 || !passwordRegex.test(password))
  ) {
    return res.status(400).json({
      message:
        "Password must be in a range of 10-255 characters and include at least one number.",
    });
  } else if (bio.length > 150) {
    return res
      .status(400)
      .json({ message: "Bio must be 150 characters or less." });
  }

  try {
    const connection = await sql.connect(dbConfig);

    // Check for existing username
    let request = connection.request();
    request.input("username", sql.VarChar, username);
    let result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Username = @username`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This username has been taken. Please use a different username.",
      });
    }

    // Check for existing email
    request = connection.request();
    request.input("email", sql.VarChar, email);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Email = @email`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This email address is connected to another account. Please use a different email address.",
      });
    }

    // Check for existing phone number
    request = connection.request();
    request.input("phoneNo", sql.VarChar, phone_number);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE PhoneNo = @phoneNo`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This phone number is connected to another account. Please use a different phone number.",
      });
    }

    const accountSqlQuery = `
        INSERT INTO Account (Username, PhoneNo, Email, Password)
        VALUES (@username, @phoneNo, @Email, @Password);
        SELECT SCOPE_IDENTITY() AS AccID;
      `;
    request = connection.request();
    request.input("username", sql.VarChar, username);
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password); // Store plain password here
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;
    console.log(accId);
    const volunteerSqlQuery = `
        INSERT INTO Volunteer (AccID, FName, LName, Username, Gender, Bio, Salt, HashedPassword, MediaPath)
        VALUES (@accId, @fname, @lname, @username, @gender, @bio, @salt, @hashedPassword, @mediapath)
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
    volunteerReq.input("mediapath", sql.VarChar, mediapath);

    await volunteerReq.query(volunteerSqlQuery);
    console.log(`Volunteer created with email ${email}`);
    res.status(201).json({ message: "Volunteer created successfully", email });
  } catch (error) {
    alert("Sign up failed: " + error.message);
  }
};

const createOrganisation = async (req, res) => {
  const {
    org_name, //
    email, //
    phone_number, //
    password, //
    issue_area, //
    mission, //
    description,
    address, //
    apt_floor_unit, //
    website, // Add website field
    mediapath,
  } = req.body;

  const { salt, hashedPassword } = await hashPassword(password);
  const username = org_name; // Set username to org_name

  // check if google sign up
  const isGoogleSignUp = !password;

  const passwordRegex = /^(?=.*\d).{10,}$/; // At least 10 characters and at least one number

  // Validate input fields
  if (org_name.length > 20) {
    return res
      .status(400)
      .json({ message: "Organisation name must be 20 characters or less." });
  } else if (phone_number.length > 8) {
    return res.status(400).json({
      message: "Phone number must be 8 digits Singaporean phone number.",
    });
  } else if (!isGoogleSignUp && email.length > 255) {
    return res
      .status(400)
      .json({ message: "Email must be 255 characters or less." });
  } else if (
    !isGoogleSignUp &&
    (password.length > 255 || !passwordRegex.test(password))
  ) {
    return res.status(400).json({
      message:
        "Password must be in a range of 10-255 characters and include at least one number.",
    });
  } else if (issue_area.length > 50) {
    return res
      .status(400)
      .json({ message: "Issue area must be 50 characters or less." });
  } else if (mission.length > 255) {
    return res
      .status(400)
      .json({ message: "Mission must be 255 characters or less." });
  } else if (description.length > 255) {
    return res
      .status(400)
      .json({ message: "Description must be 255 characters or less." });
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
    const connection = await sql.connect(dbConfig);

    // Check for existing username
    let request = connection.request();
    request.input("username", sql.VarChar, username);
    let result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Username = @username`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This username has been taken. Please use a different username.",
      });
    }

    // Check for existing email
    request = connection.request();
    request.input("email", sql.VarChar, email);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Email = @email`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This email address is connected to another account. Please use a different email address.",
      });
    }

    // Check for existing phone number
    request = connection.request();
    request.input("phoneNo", sql.VarChar, phone_number);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE PhoneNo = @phoneNo`
    );
    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        message:
          "This phone number is connected to another account. Please use a different phone number.",
      });
    }

    const accountSqlQuery = `
      INSERT INTO Account (Username, PhoneNo, Email, Password)
      VALUES (@username, @phoneNo, @Email, @Password);
      SELECT SCOPE_IDENTITY() AS AccID;
    `;
    request = connection.request();
    request.input("username", sql.VarChar, username);
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;

    const organisationSqlQuery = `
      INSERT INTO Organisation (AccID, OrgName, IssueArea, Mission, Descr, Addr, AptFloorUnit, Website, Salt, HashedPassword, MediaPath)
      VALUES (@accId, @orgName, @issueArea, @mission, @description, @address, @aptFloorUnit, @website, @salt, @hashedPassword, @mediapath)
    `;
    const organisationReq = connection.request();
    organisationReq.input("accId", sql.SmallInt, accId);
    organisationReq.input("orgName", sql.VarChar, org_name);
    organisationReq.input("issueArea", sql.VarChar, issue_area);
    organisationReq.input("mission", sql.VarChar, mission);
    organisationReq.input("description", sql.Text, description);
    organisationReq.input("address", sql.VarChar, address);
    organisationReq.input("aptFloorUnit", sql.VarChar, apt_floor_unit);
    organisationReq.input("website", sql.VarChar, website);
    organisationReq.input("salt", sql.VarChar, salt);
    organisationReq.input("hashedPassword", sql.VarChar, hashedPassword);
    organisationReq.input("mediapath", sql.VarChar, mediapath);

    await organisationReq.query(organisationSqlQuery);

    console.log(`Organisation account created with email ${email}`);
    res
      .status(201)
      .json({ message: "Organisation account created successfully", email });
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

const getRandomMediaPath = () => {
  const randomInt = Math.floor(Math.random() * 3) + 1;
  return `random${randomInt}-pfp.jpg`;
};

const googleSignupVolunteer = async (volunteerData) => {
  const {
    fname,
    lname,
    username,
    email,
    phone_number,
    gender,
    bio,
  } = volunteerData;

  const mediapath = getRandomMediaPath(); // random image path for profile picture
  const password = null; // Password is null for Google sign-up
  const salt = null; // No salt needed as no password
  const hashedPassword = null; // No hashed password needed

  try {
    const connection = await sql.connect(dbConfig);

    // Check for existing username
    let request = connection.request();
    request.input("username", sql.VarChar, username);
    let result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Username = @username`
    );
    if (result.recordset[0].count > 0) {
      throw new Error(
        "This username has been taken. Please use a different username."
      );
    }

    // Check for existing phone number
    request = connection.request();
    request.input("phoneNo", sql.VarChar, phone_number);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE PhoneNo = @phoneNo`
    );
    if (result.recordset[0].count > 0) {
      throw new Error(
        "This phone number is connected to another account. Please use a different phone number."
      );
    }

    request = connection.request();
    request.input("username", sql.VarChar, username);
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);

    const accountSqlQuery = `
      INSERT INTO Account (Username, PhoneNo, Email, Password)
      VALUES (@username, @phoneNo, @Email, @Password);
      SELECT SCOPE_IDENTITY() AS AccID;
    `;
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;

    const volunteerReq = connection.request();
    volunteerReq.input("accId", sql.SmallInt, accId);
    volunteerReq.input("fname", sql.VarChar, fname);
    volunteerReq.input("lname", sql.VarChar, lname);
    volunteerReq.input("username", sql.VarChar, username);
    volunteerReq.input("gender", sql.VarChar, gender);
    volunteerReq.input("bio", sql.VarChar, bio);
    volunteerReq.input("salt", sql.VarChar, salt);
    volunteerReq.input("hashedPassword", sql.VarChar, hashedPassword);
    volunteerReq.input("mediapath", sql.VarChar, mediapath);

    const volunteerSqlQuery = `
      INSERT INTO Volunteer (AccID, FName, LName, Username, Gender, Bio, Salt, HashedPassword, MediaPath)
      VALUES (@accId, @fname, @lname, @username, @gender, @bio, @salt, @hashedPassword, @mediapath)
    `;
    await volunteerReq.query(volunteerSqlQuery);

    console.log(`Volunteer created with email ${email}`);
    return { email };
  } catch (error) {
    console.error("Error creating volunteer:", error);
    throw error;
  }
};

const googleSignupOrganisation = async (orgData) => {
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
  } = orgData;
  const mediapath = getRandomMediaPath();
  const password = null; // Password is null for Google sign-up
  const salt = null; // No salt needed as no password
  const hashedPassword = null; // No hashed password needed
  const username = org_name; // Use org_name as username

  try {
    const connection = await sql.connect(dbConfig);

    // Check for existing username
    let request = connection.request();
    request.input("username", sql.VarChar, username);
    let result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE Username = @username`
    );
    if (result.recordset[0].count > 0) {
      throw new Error(
        "This username has been taken. Please use a different username."
      );
    }

    // Check for existing phone number
    request = connection.request();
    request.input("phoneNo", sql.VarChar, phone_number);
    result = await request.query(
      `SELECT COUNT(*) as count FROM Account WHERE PhoneNo = @phoneNo`
    );
    if (result.recordset[0].count > 0) {
      throw new Error(
        "This phone number is connected to another account. Please use a different phone number."
      );
    }

    request = connection.request();
    request.input("username", sql.VarChar, username);
    request.input("phoneNo", sql.VarChar, phone_number);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);

    const accountSqlQuery = `
      INSERT INTO Account (Username, PhoneNo, Email, Password)
      VALUES (@username, @phoneNo, @Email, @Password);
      SELECT SCOPE_IDENTITY() AS AccID;
    `;
    const accountResult = await request.query(accountSqlQuery);
    const accId = accountResult.recordset[0].AccID;

    const organisationReq = connection.request();
    organisationReq.input("accId", sql.SmallInt, accId);
    organisationReq.input("orgName", sql.VarChar, org_name);
    organisationReq.input("issueArea", sql.VarChar, issue_area);
    organisationReq.input("mission", sql.VarChar, mission);
    organisationReq.input("description", sql.Text, description);
    organisationReq.input("address", sql.VarChar, address);
    organisationReq.input("aptFloorUnit", sql.VarChar, apt_floor_unit);
    organisationReq.input("website", sql.VarChar, website);
    organisationReq.input("salt", sql.VarChar, salt);
    organisationReq.input("hashedPassword", sql.VarChar, hashedPassword);
    organisationReq.input("mediapath", sql.VarChar, mediapath);

    const organisationSqlQuery = `
      INSERT INTO Organisation (AccID, OrgName, IssueArea, Mission, Descr, Addr, AptFloorUnit, Website, Salt, HashedPassword, MediaPath)
      VALUES (@accId, @orgName, @issueArea, @mission, @description, @address, @aptFloorUnit, @website, @salt, @hashedPassword, @mediapath) 
    `;
    await organisationReq.query(organisationSqlQuery);

    console.log(`Organisation created with email ${email}`);
    return { email };
  } catch (error) {
    console.error("Error creating organisation:", error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  getAccountByEmail,
  getVolunteerByAccountId,
  getOrganisationByAccountId,
  createVolunteer,
  createOrganisation,
  googleSignupVolunteer,
  googleSignupOrganisation,
};
