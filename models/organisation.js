const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Organisation {
  constructor(
    AccID,
    OrgName,
    Website,
    IssueArea,
    Mission,
    Descr,
    Addr,
    AptFloorUnit,
    PhoneNo,
    Email,
    Password, 
    MediaPath
  ) {
    this.AccID = AccID;
    this.OrgName = OrgName;
    this.Website = Website;
    this.IssueArea = IssueArea;
    this.Mission = Mission;
    this.Descr = Descr;
    this.Addr = Addr;
    this.AptFloorUnit = AptFloorUnit;
    this.Email = Email;
    this.PhoneNo = PhoneNo;
    this.Password = Password;
    this.MediaPath = MediaPath;
  }

  //Hendrik's Parts//
  static async getAllOrganisations() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT o.*, a.PhoneNo, a.Email, a.Password
    FROM Organisation o
    INNER JOIN Account a 
    ON a.Username = o.OrgName`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Organisation(
          row.AccID,
          row.OrgName,
          row.Website,
          row.IssueArea,
          row.Mission,
          row.Descr,
          row.Addr,
          row.AptFloorUnit,
          row.PhoneNo,
          row.Email,
          row.Password,
          row.MediaPath
        )
    );
  }
  static async getOrgById(id) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", id);

    const sqlQuery = `
    SELECT O.*, A.Email, A.PhoneNo, A.Password
    FROM Organisation O INNER JOIN Account A ON O.OrgName = A.Username
    WHERE A.AccID = @id`;

    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Organisation(
          result.recordset[0].AccID,
          result.recordset[0].OrgName,
          result.recordset[0].Website,
          result.recordset[0].IssueArea,
          result.recordset[0].Mission,
          result.recordset[0].Descr,
          result.recordset[0].Addr,
          result.recordset[0].AptFloorUnit,
          result.recordset[0].PhoneNo,
          result.recordset[0].Email,
          result.recordset[0].Password,
          result.recordset[0].MediaPath
        )
      : null; // Handle organisation not found
  }
  
  static async updateOrgProfile(id, updatedOrg) {
    try {
      //establish database connection
      const connection = await sql.connect(dbConfig);
      //sql query to select everything based on the org name
      const selectAllQuery = `
    SELECT o.*, a.PhoneNo, a.Email, a.Password
    FROM Organisation o
    INNER JOIN Account a ON o.OrgName = a.Username
    WHERE o.AccId = @id   
    `;
      // console.log("updatedorg", updatedOrg);
      // console.log(updatedOrg[0].OrgName);

      const request = connection.request();
      // console.log("id", id); //2
      request.input("id", id);
      const selectAllResult = await request.query(selectAllQuery);
      // console.log("here", selectAllResult.recordset[0]);

      const orgQuery = `
    UPDATE Organisation SET
    OrgName = @OrgName,
    IssueArea = @IssueArea,
    Mission = @Mission,
    Descr = @Descr,
    Addr = @Addr,
    AptFloorUnit = @AptFloorUnit
    WHERE AccId = ${selectAllResult.recordset[0].AccID}
    `;

      const orgReq = connection.request();
      //console.log("L116", selectAllResult.recordset[0].AccID); //2
      orgReq.input("AccID", selectAllResult.recordset[0].AccID);
      orgReq.input(
        "OrgName",
        updatedOrg[0].OrgName || selectAllResult.recordset[0].OrgName
      );
      orgReq.input(
        "IssueArea",
        updatedOrg[0].IssueArea || selectAllResult.recordset[0].IssueArea
      );
      orgReq.input(
        "Mission",
        updatedOrg[0].Mission || selectAllResult.recordset[0].Mission
      );
      orgReq.input(
        "Descr",
        updatedOrg[0].Descr || selectAllResult.recordset[0].Descr
      );
      orgReq.input(
        "Addr",
        updatedOrg[0].Addr || selectAllResult.recordset[0].Addr
      );

      orgReq.input(
        "AptFloorUnit",
        updatedOrg[0].AptFloorUnit || selectAllResult.recordset[0].AptFloorUnit
      );

      await orgReq.query(orgQuery);

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
        updatedOrg[0].OrgName || selectAllResult.recordset[0].Username
      );
      accountReq.input(
        "PhoneNo",
        updatedOrg[0].PhoneNo || selectAllResult.recordset[0].PhoneNo
      );
      accountReq.input(
        "Email",
        updatedOrg[0].Email || selectAllResult.recordset[0].Email
      );
      accountReq.input(
        "Password",
        updatedOrg[0].Password || selectAllResult.recordset[0].Password
      );

      await accountReq.query(accountQuery);

      connection.close();
      return this.getOrgById(id);
    } catch (err) {
      console.error(err);
    }
  }
  static async deleteOrganisation(id) {
    try {
      const connection = await sql.connect(dbConfig);

      // Define the parameter type when setting it
      const organisationQuery = `DELETE FROM Organisation
      WHERE AccID = @id`;

      const request = connection.request();
      request.input("id", sql.Int, id); // Specify the parameter type
      const oResult = await request.query(organisationQuery);

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

  //caden//
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

  static async getOrgByName(OrgName) {
    const connection = await sql.connect(dbConfig);
    // Sql query that returns account similar to the one entered
    const sqlQuery = `
    SELECT O.*, A.Email, A.PhoneNo 
    FROM Organisation O
    INNER JOIN Account A ON O.OrgName = A.Username
    WHERE O.OrgName LIKE '%' + @OrgName + '%'
      OR SOUNDEX(O.OrgName) = SOUNDEX(@OrgName)
      OR DIFFERENCE(O.OrgName, @OrgName) > 2
    ORDER BY DIFFERENCE(O.OrgName, @OrgName) DESC;
  `;
    const request = connection.request();
    request.input("OrgName", OrgName);
    const result = await request.query(sqlQuery);

    connection.close();
    return result.recordset[0]
      ? new Organisation(
          result.recordset[0].AccID,
          result.recordset[0].OrgName,
          result.recordset[0].IssueArea,
          result.recordset[0].Mission,
          result.recordset[0].Descr,
          result.recordset[0].Addr,
          result.recordset[0].AptFloorUnit,
          result.recordset[0].PhoneNo,
          result.recordset[0].Email,
          result.recordset[0].Password
        )
      : null; // Handle organisation not found
  }

  static async getOrgDetails(orgId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      SELECT o.AccID, o.OrgName, o.Mission, 
        COUNT(l.ListingID) AS NumListings,
        (SELECT COUNT(*) FROM Follower WHERE Follower = o.AccID) AS NumFollowers,
        (SELECT COUNT(*) FROM Follower WHERE FollowedBy = o.AccID) AS NumFollowing
      FROM Organisation o
      LEFT JOIN Listing l 
      ON o.AccID = l.PostedBy
      WHERE o.AccID = @orgId
      GROUP BY o.AccID, o.OrgName, o.Mission`;

    const request = connection.request();
    request.input("orgId", sql.SmallInt, orgId);
    const result = await request.query(sqlQuery);
    connection.close();

    return result.recordset[0];
  }

}
module.exports = Organisation;
