const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Volunteer {
  constructor(
    AccID,
    FName,
    LName,
    Username,
    Email,
    PhoneNo,
    Bio,
    Password,
    Gender
  ) {
    this.AccID = AccID;
    this.FName = FName;
    this.Lname = LName;
    this.Username = Username;
    this.Email = Email;
    this.PhoneNo = PhoneNo;
    this.Bio = Bio;
    this.Password = Password;
    this.Gender = Gender;
  }

  static async getAllVolunteer() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Volunteer`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Volunteer(
          row.AccID,
          row.FName,
          row.LName,
          row.Username,
          row.Email,
          row.PhoneNo,
          row.Bio,
          row.Password,
          row.Gender
        )
    );
  }

  static async getVolunteerByUsername(username) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    SELECT V.*, A.Email, A.PhoneNo, A.Password
    FROM Volunteer V
    INNER JOIN Account A ON V.Username = A.Username
    WHERE V.Username = @username;
  `;
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    connection.close();
    return result.recordset[0]
      ? new Volunteer(
          result.recordset[0].AccID,
          result.recordset[0].FName,
          result.recordset[0].LName,
          result.recordset[0].Username,
          result.recordset[0].Email,
          result.recordset[0].PhoneNo,
          result.recordset[0].Bio,
          result.recordset[0].Password,
          result.recordset[0].Gender
        )
      : null; // Handle volunteer not found
  }

  static async updateVolunteerProfile(username, updatedVolunteer) {
    const connection = await sql.connect(dbConfig);
  }
}

module.exports = Volunteer;
