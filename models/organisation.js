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
    Email,
    PhoneNo,
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
    const sqlQuery = `
    SELECT O.*, A.Email, A.PhoneNo, A.Password
    FROM Organisation O
    INNER JOIN Account A ON O.OrgName = A.Username
    WHERE O.OrgName = @OrgName;
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
          result.recordset[0].Email,
          result.recordset[0].PhoneNo,
          result.recordset[0].Password
        )
      : null; // Handle volunteer not found
  }
}

module.exports = Organisation;
