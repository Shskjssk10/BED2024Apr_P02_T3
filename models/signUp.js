const sql = require("mssql");
const dbConfig = require("../dbConfig");

class SignUp {
  constructor (AccID, ListingID){
    this.AccID = AccID;
    this.ListingID = ListingID;
  }
  static async getAllSignUpByListingID(AccID, ListingID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    SELECT *
    FROM SignUp
    WHERE AccID = @AccID AND ListingID = @ListingID;`

    const request = connection.request();
    request.input("AccID", AccID);
    request.input("ListingID", ListingID);
    const result = await request.query(sqlQuery);

    connection.close();
    return result.recordset.map(
      (row) =>
        new SignUp(
          row.AccID,
          row.ListingID,
        )
    );
  } 
  static async postSignUp(postSignUp) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    INSERT INTO SignUp (AccID, ListingID) 
    VALUES (@AccID, @ListingID); 
    `;

    const request = connection.request();
    request.input("AccID", postSignUp.AccID);
    request.input("ListingID", postSignUp.ListingID);

    const result = await request.query(sqlQuery);

    connection.close();
  }
  static async deleteSignUp(deleteSignUp) {
    //establish database connection
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    DELETE FROM SignUp
    WHERE AccID = @AccID AND ListingID = @ListingID; 
    `;

    const request = connection.request();
    request.input("AccID", deleteSignUp.AccID);
    request.input("ListingID", deleteSignUp.ListingID);

    const result = await request.query(sqlQuery);

    connection.close();
  }
}

module.exports = SignUp;