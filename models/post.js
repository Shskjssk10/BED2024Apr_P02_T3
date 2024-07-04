const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post {
    constructor (PostID, PostedBy, CreatedAt, MediaPath, Caption) {
        this.PostID = PostID;
        this.PostedBy = PostedBy;
        this.CreatedAt = CreatedAt;
        this.MediaPath = MediaPath;
        this.Caption = Caption;
    }

    static async getAllPostsByAccID(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT *
        FROM Post
        WHERE PostedBy = @id`;

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 1) {
            return [new Post(
                result.recordset[0].PostID,
                result.recordset[0].PostedBy,
                result.recordset[0].CreatedAt,
                result.recordset[0].MediaPath,
                result.recordset[0].Caption
            )]; // Wrap the single Post object in an array
        } else {
            // 2. Map multiple posts to Post objects if needed
            const posts = result.recordset.map(row => new Post(
                row.PostID,
                row.PostedBy,
                row.CreatedAt,
                row.MediaPath,
                row.Caption
            ));
            return posts; 
        }
    }
}
module.exports = Post;