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

  //Hendrik's Parts
  static async getAllVolunteer() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT v.*, a.PhoneNo, a.Email, a.Password
    FROM Volunteer v
    INNER JOIN Account a 
    ON a.Username = v.Username`;
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
          row.Gender,
          row.Bio,
          row.Email,
          row.PhoneNo,

          row.Password
        )
    );
  }
  static async getVolunteerById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    SELECT V.*, A.Email, A.PhoneNo, A.Password
    FROM Volunteer V INNER JOIN Account A ON V.Username = A.Username
    WHERE A.AccID = @id`;

    const request = connection.request();
    request.input("id", id);
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
          result.recordset[0].Email,
          result.recordset[0].PhoneNo,
          result.recordset[0].Password
        )
      : null; // Handle volunteer not found
  }
  static async updateVolunteerProfile(id, updatedVolunteer) {
    //establish database connection
    try {
      const connection = await sql.connect(dbConfig);
      const selectAllQuery = `
    SELECT V.*, A.Email, A.PhoneNo, A.Password
    FROM Volunteer V
    INNER JOIN Account A ON V.AccID = A.AccID
    WHERE V.AccID = @id;
    `;

      // console.log("here", updatedVolunteer); //gets tommy
      // console.log(updatedVolunteer[0].FName); //only get those put into json

      const request = connection.request();
      // console.log("id", id);
      request.input("id", id);
      const selectAllResult = await request.query(selectAllQuery);
      // console.log("select res", selectAllResult.recordset[0]);

      const volunteerQuery = `UPDATE Volunteer SET
      FName = @FName,
      LName = @LName,
      Username = @Username,
      Bio = @Bio
      WHERE AccID = ${selectAllResult.recordset[0].AccID}
      `;

      const volunteerReq = connection.request();
      volunteerReq.input("AccID", selectAllResult.recordset[0].AccID);
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

      const accountQuery = `UPDATE Account SET
      Username = @Username,
      PhoneNo = @PhoneNo,
      Email = @Email,
      Password = @Password
      WHERE AccID = ${selectAllResult.recordset[0].AccID}
      `;

      const accountReq = connection.request();
      accountReq.input("AccID", selectAllResult.recordset[0].AccID);
      accountReq.input(
        "Username",
        updatedVolunteer[0].Username || selectAllResult.recordset[0].Username
      );
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
      return this.getVolunteerById(id);
    } catch (err) {
      console.error(err);
    }
  }
  static async deleteVolunteer(id) {
    try {
      const connection = await sql.connect(dbConfig);

      // Define the parameter type when setting it
      const volunteerQuery = `DELETE FROM Volunteer
      WHERE AccID = @id`;

      const request = connection.request();
      request.input("id", sql.Int, id); // Specify the parameter type
      const vResult = await request.query(volunteerQuery);

      const accountQuery = `DELETE FROM Account 
      WHERE AccID = @id`;

      // Use the same connection object for the second query
      const accountReq = connection.request();
      accountReq.input("id", sql.Int, id); // Specify the parameter type again
      const aResult = await accountReq.query(accountQuery);

      connection.close(); // Close the connection after queries are done
    } catch (err) {
      console.log(err);
      // Optionally, you can handle errors more gracefully here
    }
  }

  static async getVolunteerByUsername(username) {
    const connection = await sql.connect(dbConfig);
    // Sql query that returns account similar to the one entered
    const sqlQuery = `
    SELECT V.*, A.Email, A.PhoneNo
    FROM Volunteer V
    INNER JOIN Account A ON V.Username = A.Username
    WHERE V.Username LIKE '%' + @username + '%'
      OR SOUNDEX(V.Username) = SOUNDEX(@username)
      OR DIFFERENCE(V.Username, @username) > 2 
    ORDER BY DIFFERENCE(V.Username, @username) DESC;
  `;
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    console.log("hello");
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
  // Caden's Parts //
  static async getAllFollowersAndFollowing(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
    SELECT
      COUNT(CASE WHEN Follower = @id THEN 1 END) AS 'No of Followers',
      COUNT(CASE WHEN FollowedBy = @id THEN 1 END) AS 'No of Following'
    FROM
      Follower; `;

    const request = connection.request();
    request.input("id", id);

    const result = await request.query(sqlQuery);
    connection.close();
    return [
      {
        Followers: result.recordset[0]["No of Followers"],
        Following: result.recordset[0]["No of Following"],
      },
    ];
  }

  static async postComment(postComment) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Comment (AccID, PostID, Comment) VALUES (@AccID, @PostID, @Comment); SELECT SCOPE_IDENTITY() AS id;`;

    const request = connection.request();
    request.input("AccID", postComment.AccID);
    request.input("PostID", postComment.PostID);
    request.input("Comment", postComment.Comment);

    const result = await request.query(sqlQuery);

    connection.close();
  }
}
module.exports = Volunteer;
