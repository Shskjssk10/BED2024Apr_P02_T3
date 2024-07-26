const sql = require("mssql");
const dbConfig = require("../dbConfig");

class SavedListing {
  constructor (AccID, ListingID){
    this.AccID = AccID;
    this.ListingID = ListingID;
  }
  static async getAllSavedByListingID(AccID, ListingID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    SELECT *
    FROM SavedListing
    WHERE AccID = @AccID AND ListingID = @ListingID;`

    const request = connection.request();
    request.input("AccID", AccID);
    request.input("ListingID", ListingID);
    const result = await request.query(sqlQuery);

    connection.close();
    return result.recordset.map(
      (row) =>
        new SavedListing(
          row.AccID,
          row.ListingID,
        )
    );
  } 
  static async postSaved(postSaved) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    INSERT INTO SavedListing (AccID, ListingID) 
    VALUES (@AccID, @ListingID); 
    `;

    const request = connection.request();
    request.input("AccID", postSaved.AccID);
    request.input("ListingID", postSaved.ListingID);

    const result = await request.query(sqlQuery);

    connection.close();
  }
  static async deleteSaved(deleteSaved) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    DELETE FROM SavedListing
    WHERE AccID = @AccID AND ListingID = @ListingID; 
    `;

    const request = connection.request();
    request.input("AccID", deleteSaved.AccID);
    request.input("ListingID", deleteSaved.ListingID);
    const result = await request.query(sqlQuery);

    connection.close();
  }
}

module.exports = SavedListing;