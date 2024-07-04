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
}

module.exports = Listing;