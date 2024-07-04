const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Organisation {
  constructor(
    id,
    OrgName,
    IssueArea,
    Mission,
    Descr,
    Addr,
    AptFloorUnit,
    PhoneNo,
    Email,
    Password
  ) {
    this.id = id;
    this.OrgName = OrgName;
    this.IssueArea = IssueArea;
    this.Mission = Mission;
    this.Descr = Descr;
    this.Addr = Addr;
    this.AptFloorUnit = AptFloorUnit;
    this.Email = Email;
    this.PhoneNo = PhoneNo;
    this.Password = Password;
  }

  static async getAllOrganisations() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Organisation`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Organisation(
          row.AccID,
          row.OrgName,
          row.IssueArea,
          row.Mission,
          row.Descr,
          row.Addr,
          row.AptFloorUnit,
          row.Email,
          row.PhoneNo,
          row.Password
        )
    );
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
}
module.exports = Organisation;
