const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Volunteer {
  constructor(
    AccID,
    FName,
    LName,
    Username,
    Gender,
    Bio,
    Email,
    PhoneNo,
    Password
  ) {
    this.AccID = AccID;
    this.FName = FName;
    this.LName = LName;
    this.Username = Username;
    this.Gender = Gender;
    this.Bio = Bio;
    this.Email = Email;
    this.PhoneNo = PhoneNo;
    this.Password = Password;
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
          result.recordset[0].Gender,
          result.recordset[0].Bio,
          result.recordset[0].PhoneNo,
          result.recordset[0].Email,
          result.recordset[0].Password
        )
      : null; // Handle volunteer not found
  }

  static async updateVolunteerProfile(username, updatedVolunteer) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    //gets AccId, FName, LName, Username, Gender, Bio, Salt, HashedPassword, PhoneNo, Email, Password
    const selectAllQuery = `
    SELECT v.*, a.PhoneNo, a.Email, a.Password
    FROM Volunteer v
    INNER JOIN Account a ON v.Username = a.Username
    WHERE v.Username = @username`;

    // console.log(updatedVolunteer);
    // console.log(updatedVolunteer[0].LName);

    const request = connection.request();
    request.input("Username", username);

    //execute query
    //gets AccId, FName, LName, Username, Gender, Bio, Salt, HashedPassword, PhoneNo, Email, Password
    const selectAllResult = await request.query(selectAllQuery);
    //gets the id of the user to update successfully logs 3 for js
    //console.log(selectAllResult.recordset[0]);

    const volunteerQuery = `
    UPDATE Volunteer SET
    FName = @FName,
    LName = @LName,
    Username = @Username,
    Bio = @Bio
    WHERE AccID = @AccId
    `;

    const volunteerReq = connection.request();
    volunteerReq.input("AccId", selectAllResult.recordset[0].AccID);
    volunteerReq.input(
      "FName",
      updatedVolunteer[0].FName || selectAllResult.recordset[0].FName
    );
    volunteerReq.input(
      "LName",
      updatedVolunteer[0].LName || selectAllResult.recordset[0].LName
    );
    volunteerReq.input(
      "Username",
      updatedVolunteer[0].Username || selectAllResult.recordset[0].Username
    );
    volunteerReq.input(
      "Bio",
      updatedVolunteer[0].Bio || selectAllResult.recordset[0].Bio
    );
    await volunteerReq.query(volunteerQuery);

    const accountQuery = `
    UPDATE Account SET
    PhoneNo = @PhoneNo,
    Email = @Email,
    Password = @Password
    WHERE AccID = @AccId
    `;

    const accountReq = connection.request();
    accountReq.input("AccId", selectAllResult.recordset[0].AccID);
    accountReq.input(
      "PhoneNo",
      updatedVolunteer[0].PhoneNo || selectAllResult.recordset[0].PhoneNo
    );
    accountReq.input(
      "Email",
      updatedVolunteer[0].Email || selectAllResult.recordset[0].Email
    );
    accountReq.input(
      "Password",
      updatedVolunteer[0].Password || selectAllResult.recordset[0].Password
    );
    await accountReq.query(accountQuery);

    connection.close();

    return this.getVolunteerByUsername(username);
  }
}
module.exports = Volunteer;
