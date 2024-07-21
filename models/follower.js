const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Follower {
  constructor (Follower, FollowedBy) {
      this.Follower = Follower;
      this.FollowedBy = FollowedBy;
  }
  static async getAllFollowerRelations() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      SELECT * FROM Follower;
    `;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Follower(
          row.Follower,
          row.FollowedBy
        )
    );
  }
  static async getFollowersByID(id){
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      SELECT COUNT(*) AS 'NoFollowers'
      FROM Follower
      WHERE Follower = @id;
    `;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();
    console.log("🚀 ~ Follower ~ getFollowersByID ~ result.recordset:", result)
    return result.recordset.map(
      (row) =>
        new Follower(
          row.NoFollowers
        )
    );
  }
}

module.exports = Follower;