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
}