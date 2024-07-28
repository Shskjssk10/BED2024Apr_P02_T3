const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comment {
  constructor (CommentID, AccID, PostID, CreatedAt, Comment) {
      this.CommentID = CommentID;
      this.AccID = AccID;
      this.PostID = PostID;
      this.CreatedAt = CreatedAt;
      this.Comment = Comment;
  }
  static async getAllCommentsByPostID(id){
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      SELECT *
      FROM Comment 
      WHERE PostID = @id;
    `;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();
    return result.recordset.map(
      (row) =>
        new Comment(
          row.CommentID,
          row.AccID,
          row.PostID,
          row.CreatedAt,
          row.Comment
        )
    );
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

module.exports = Comment;