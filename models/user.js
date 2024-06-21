const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(
    id,
    fname,
    lname,
    username,
    email,
    phone_number,
    bio,
    password,
    gender
  ) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.bio = bio;
    this.password = password;
    this.gender = gender;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new User(
          row.id,
          row.fname,
          row.lname,
          row.username,
          row.email,
          row.phone_number,
          row.bio,
          row.password,
          row.gender
        )
    );
  }

  static async getUserByUsername(username) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE username = @username`; // Parameterized query

    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].fname,
          result.recordset[0].lname,
          result.recordset[0].username,
          result.recordset[0].email,
          result.recordset[0].phone_number,
          result.recordset[0].bio,
          result.recordset[0].password
        )
      : null;
  }

  static async updateUserProfile(username, updatedUser) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE Users 
    SET 
    fname = @fname, 
    lname = @lname, 
    username = @username 
    email = @email, 
    phone_number = @phone_number,
    bio = @bio
    WHERE username = @username`; // Parameterized query

    const request = connection.request();
    request.input("username", username);
    //handle optional fields
    request.input("first name", updatedUser.fname || null);
    request.input("last name", updatedUser.lname || null);
    request.input("userName", updatedUser.userName || null);
    request.input("email", updatedUser.email || null);
    request.input("phone number", updatedUser.phone_number || null);
    request.input("bio", updatedUser.bio || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserByUsername(username);
  }
}

module.exports = User;
