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
    gender,
    password
  ) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.gender = gender;
    this.password = password;
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
          row.gender,
          row.password
        )
    );
  }
}
