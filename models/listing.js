const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Listing {
    constructor (
        ListingID, 
        PostedBy,
        ListingName,
        Addr, 
        StartDate,
        EndDate, 
        CauseArea,
        Skill,
        Requirements,
        About, 
        MediaPath
    ) {
        this.ListingID = ListingID;
        this.PostedBy = PostedBy;
        this.ListingName = ListingName;
        this.Addr = Addr;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.CauseArea = CauseArea;
        this.Skill = Skill;
        this.Requirements = Requirements;
        this.About = About;
        this.MediaPath = MediaPath;
    }

    static async getAllListings() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Listing`;
        const request = connection.request();
        const result = await request.query(sqlQuery); 

        connection.close();

        return result.recordset.map(
            (row) =>
              new Listing(
                row.ListingID,
                row.PostedBy,
                row.ListingName,
                row.StartDate,
                row.EndDate,
                row.CauseArea,
                row.Skill,
                row.Requirements,
                row.About,
                row.MediaPath
            )
        );
    }
    static async getSignUpListingsById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT l.* 
        FROM Listing l
        INNER JOIN SignUp su ON su.ListingID = l.ListingID
        WHERE su.AccID = @id`;

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 1) {
            return [new Listing(
                result.recordset[0].ListingID,
                result.recordset[0].PostedBy,
                result.recordset[0].ListingName,
                result.recordset[0].StartDate,
                result.recordset[0].EndDate, 
                result.recordset[0].CauseArea, 
                result.recordset[0].Skill, 
                result.recordset[0].Requirements, 
                result.recordset[0].About, 
                result.recordset[0].MediaPath, 
            )]; // Wrap the single Post object in an array
        } else {
            // 2. Map multiple posts to Post objects if needed
            const posts = result.recordset.map(row => new Listing(
                row.ListingID,
                row.PostedBy,
                row.ListingName,
                row.StartDate,
                row.EndDate,
                row.CauseArea,
                row.Skill,
                row.Requirements,
                row.About,
                row.MediaPath
            ));
            return posts; 
        }
    }
    static async getSavedListingsById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT l.*
        FROM Listing l
        INNER JOIN SavedListing sl ON sl.ListingID = l.ListingID
        WHERE sl.AccID = @id`;

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 1) {
            return [new Listing(
                result.recordset[0].ListingID,
                result.recordset[0].PostedBy,
                result.recordset[0].ListingName,
                result.recordset[0].StartDate,
                result.recordset[0].EndDate, 
                result.recordset[0].CauseArea, 
                result.recordset[0].Skill, 
                result.recordset[0].Requirements, 
                result.recordset[0].About, 
                result.recordset[0].MediaPath, 
            )]; // Wrap the single Post object in an array
        } else {
            // 2. Map multiple posts to Post objects if needed
            const posts = result.recordset.map(row => new Listing(
                row.ListingID,
                row.PostedBy,
                row.ListingName,
                row.StartDate,
                row.EndDate,
                row.CauseArea,
                row.Skill,
                row.Requirements,
                row.About,
                row.MediaPath
            ));
            return posts; 
        }
    }
}

module.exports = Listing;