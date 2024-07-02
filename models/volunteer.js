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
    this.Lname = LName;
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
    WHERE v.Username = @Username`;

    const request = connection.request();
    request.input("Username", username);

    //execute query
    //gets AccId, FName, LName, Username, Gender, Bio, Salt, HashedPassword, PhoneNo, Email, Password
    const selectAllResult = await request.query(selectAllQuery);
    //gets the id of the user to update successfully logs 3 for js
    // console.log(selectAllResult.recordset[0].AccID);

    const volunteerQuery = `
    UPDATE Volunteer SET
    FName = @FName,
    LName = @LName,
    Username = @Username,
    Bio = @Bio
    WHERE AccID = ${selectAllResult.recordset[0].AccID}
    `;

    const volunteerReq = connection.request();
    volunteerReq.input(
      "FName",
      updatedVolunteer.FName || selectAllResult.recordset[0].FName
    );
    volunteerReq.input(
      "LName",
      updatedVolunteer.LName || selectAllResult.recordset[0].LName
    );
    volunteerReq.input(
      "Username",
      updatedVolunteer.Username || selectAllResult.recordset[0].Username
    );
    volunteerReq.input(
      "Bio",
      updatedVolunteer.Bio || selectAllResult.recordset[0].Bio
    );
    await volunteerReq.query(volunteerQuery);

    const accountQuery = `
    UPDATE Account SET
    PhoneNo = @PhoneNo,
    Email = @Email,
    Password = @Password
    WHERE AccID = ${selectAllResult.recordset[0].AccID}
    `;

    const accountReq = connection.request();
    accountReq.input(
      "PhoneNo",
      updatedVolunteer.PhoneNo || selectAllResult.recordset[0].PhoneNo
    );
    accountReq.input(
      "Email",
      updatedVolunteer.Email || selectAllResult.recordset[0].Email
    );
    accountReq.input(
      "Password",
      updatedVolunteer.Password || selectAllResult.recordset[0].Password
    );
    await accountReq.query(accountQuery);

    connection.close();

    return this.getVolunteerByUsername(username);
  }

  // Caden's Parts //

  static async postFollow(postFollow){
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Follower (follower, followedBy) VALUES (@follower, @followedBy);`
    
    const request = connection.request();
    request.input("follower", postFollow.follower);
    request.input("followedBy", postFollow.followedBy);

    const result = await request.query(sqlQuery);

    connection.close()
  }

  static async deleteFollow(deleteFollow){
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Follower WHERE follower = @follower AND followedBy = @followedBy`; // Parameterized query

    const request = connection.request();
    request.input("follower", deleteFollow.follower);
    request.input("followedBy", deleteFollow.followedBy);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async postComment(postComment){
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Comment (AccID, PostID, Comment) VALUES (@AccID, @PostID, @Comment); SELECT SCOPE_IDENTITY() AS id;`
    
    const request = connection.request();
    request.input("AccID", postComment.AccID);
    request.input("PostID", postComment.PostID);
    request.input("Comment", postComment.Comment);

    const result = await request.query(sqlQuery);

    connection.close()
  }
}
module.exports = Volunteer;
