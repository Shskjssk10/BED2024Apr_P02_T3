const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Organisation {
  constructor(
    id,
    org_name,
    email,
    org_phone_number,
    password,
    issue_area,
    mission,
    description,
    address,
    apt_floor_unit
  ) {
    this.id = id;
    this.org_name = org_name;
    this.email = email;
    this.org_phone_number = org_phone_number;
    this.password = password;
    this.issue_area = issue_area;
    this.mission = mission;
    this.description = description;
    this.address = address;
    this.apt_floor_unit = apt_floor_unit;
  }

  static async getAllOrganisations() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM dbo.Organisations`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Organisation(
          row.id,
          row.org_name,
          row.email,
          row.org_phone_number,
          row.password,
          row.issue_area,
          row.mission,
          row.description,
          row.address,
          row.apt_floor_unit
        )
    );
  }

  static async;
}

module.exports = Organisation;
