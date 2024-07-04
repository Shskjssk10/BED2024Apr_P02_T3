const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Likes {
    constructor (AccID, PostID) {
        this.AccID = AccID;
        this.PostID = PostID;
    }
    static async getAllLikesById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT COUNT(*) AS 'No. of Likes'
        FROM Likes
        WHERE PostID = @id`;

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }
    static async postLikeById(postLike){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Likes (AccID, PostID) VALUES (@AccID, @PostID);`
        
        const request = connection.request();
        request.input("AccID", postLike.AccID);
        request.input("PostID", postLike.PostID);

        const result = await request.query(sqlQuery);

        connection.close()
    }
    static async deleteLikesById(deleteLike){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Likes WHERE AccID = @AccID AND PostID = @PostID`
        
        const request = connection.request();
        request.input("AccID", deleteLike.AccID);
        request.input("PostID", deleteLike.PostID);

        const result = await request.query(sqlQuery);

        connection.close()
    }
}

module.exports = Likes;