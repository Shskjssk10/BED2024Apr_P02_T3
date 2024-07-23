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
  static async postFollow(postFollow) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Follower (follower, followedBy) VALUES (@follower, @followedBy);`;

    const request = connection.request();
    request.input("follower", postFollow.follower);
    request.input("followedBy", postFollow.followedBy);

    const result = await request.query(sqlQuery);

    connection.close();
  }

  static async deleteFollow(deleteFollow) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Follower WHERE follower = @follower AND followedBy = @followedBy`; // Parameterized query

    const request = connection.request();
    request.input("follower", deleteFollow.follower);
    request.input("followedBy", deleteFollow.followedBy);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Follower;