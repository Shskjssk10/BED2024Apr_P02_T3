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
      : null; // Handle book not found
  }

  static async updateUserProfile(username, updatedUser) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE
       
    
    `;
  }
}

module.exports = User;
