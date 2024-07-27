const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Listing {
  constructor(
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
          row.Addr,
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
  static async getListingByListingName(username) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    SELECT *
    FROM Listing
    WHERE ListingName LIKE '%' + @username + '%'
      OR SOUNDEX(ListingName) = SOUNDEX(@username)
      OR DIFFERENCE(ListingName, @username) > 2 
    ORDER BY DIFFERENCE(ListingName, @username) DESC;
  `;
  const request = connection.request();
  request.input("username", username);
  const result = await request.query(sqlQuery);

  connection.close();
  if (result.recordset.length === 1) {
    return [
      new Listing(
        result.recordset[0].ListingID,
        result.recordset[0].PostedBy,
        result.recordset[0].ListingName,
        result.recordset[0].Addr,
        result.recordset[0].StartDate,
        result.recordset[0].EndDate,
        result.recordset[0].CauseArea,
        result.recordset[0].Skill,
        result.recordset[0].Requirements,
        result.recordset[0].About,
        result.recordset[0].MediaPath
      ),
    ]; // Wrap the single Post object in an array
  } else {
    // 2. Map multiple posts to Post objects if needed
    const posts = result.recordset.map(
      (row) =>
        new Listing(
          row.ListingID,
          row.PostedBy,
          row.ListingName,
          row.Addr,
          row.StartDate,
          row.EndDate,
          row.CauseArea,
          row.Skill,
          row.Requirements,
          row.About,
          row.MediaPath
        )
    );
    return posts;
    }
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
      return [
        new Listing(
          result.recordset[0].ListingID,
          result.recordset[0].PostedBy,
          result.recordset[0].ListingName,
          result.recordset[0].Addr,
          result.recordset[0].StartDate,
          result.recordset[0].EndDate,
          result.recordset[0].CauseArea,
          result.recordset[0].Skill,
          result.recordset[0].Requirements,
          result.recordset[0].About,
          result.recordset[0].MediaPath
        ),
      ]; // Wrap the single Post object in an array
    } else {
      // 2. Map multiple posts to Post objects if needed
      const posts = result.recordset.map(
        (row) =>
          new Listing(
            row.ListingID,
            row.PostedBy,
            row.ListingName,
            row.Addr,
            row.StartDate,
            row.EndDate,
            row.CauseArea,
            row.Skill,
            row.Requirements,
            row.About,
            row.MediaPath
          )
      );
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
      return [
        new Listing(
          result.recordset[0].ListingID,
          result.recordset[0].PostedBy,
          result.recordset[0].ListingName,
          result.recordset[0].Addr,
          result.recordset[0].StartDate,
          result.recordset[0].EndDate,
          result.recordset[0].CauseArea,
          result.recordset[0].Skill,
          result.recordset[0].Requirements,
          result.recordset[0].About,
          result.recordset[0].MediaPath
        ),
      ]; // Wrap the single Post object in an array
    } else {
      // 2. Map multiple posts to Post objects if needed
      const posts = result.recordset.map(
        (row) =>
          new Listing(
            row.ListingID,
            row.PostedBy,
            row.ListingName,
            row.Addr,
            row.StartDate,
            row.EndDate,
            row.CauseArea,
            row.Skill,
            row.Requirements,
            row.About,
            row.MediaPath
          )
      );
      return posts;
    }
  }
  static async getListingsByOrgId(orgID) {
    const connection = await sql.connect(dbConfig);

    console.log(orgID);
    const sqlQuery = ` 
        SELECT *  
        FROM Listing 
        WHERE PostedBy = @orgID`;

    const request = connection.request();
    request.input("orgID", orgID);
    const result = await request.query(sqlQuery);

    console.log(result);

    connection.close();
    if (result.recordset.length === 1) {
      return [
        new Listing(
          result.recordset[0].ListingID,
          result.recordset[0].PostedBy,
          result.recordset[0].ListingName,
          result.recordset[0].Addr,
          result.recordset[0].StartDate,
          result.recordset[0].EndDate,
          result.recordset[0].CauseArea,
          result.recordset[0].Skill,
          result.recordset[0].Requirements,
          result.recordset[0].About,
          result.recordset[0].MediaPath
        ),
      ]; // Wrap the single Post object in an array
    } else {
      // 2. Map multiple posts to Post objects if needed
      const posts = result.recordset.map(
        (row) =>
          new Listing(
            row.ListingID,
            row.PostedBy,
            row.ListingName,
            row.Addr,
            row.StartDate,
            row.EndDate,
            row.CauseArea,
            row.Skill,
            row.Requirements,
            row.About,
            row.MediaPath
          )
      );
      console.log(posts);
      return posts;
    }
  }
  static async getListingsByListingId(id) {
    const connection = await sql.connect(dbConfig);

    console.log(id);
    const sqlQuery = ` 
        SELECT *  
        FROM Listing 
        WHERE ListingID = @id`;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    console.log(result);

    connection.close();

    return [
      new Listing(
        result.recordset[0].ListingID,
        result.recordset[0].PostedBy,
        result.recordset[0].ListingName,
        result.recordset[0].Addr,
        result.recordset[0].StartDate,
        result.recordset[0].EndDate,
        result.recordset[0].CauseArea,
        result.recordset[0].Skill,
        result.recordset[0].Requirements,
        result.recordset[0].About,
        result.recordset[0].MediaPath
      ),
    ]; // Wrap the single Post object in an array
  }
  static async postListing(listingDetails) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Listing  
    (PostedBy, 
    ListingName, 
    Addr,  
    StartDate, 
    EndDate, 
    CauseArea, 
    Skill, 
    Requirements, 
    About, 
    MediaPath)  
    VALUES (@PostedBy, 
    @ListingName, 
    @Addr,  
    @StartDate, 
    @EndDate, 
    @CauseArea, 
    @Skill, 
    @Requirements, 
    @About, 
    @MediaPath);`;

    const request = connection.request();
    request.input("PostedBy", listingDetails.PostedBy);
    request.input("ListingName", listingDetails.ListingName);
    request.input("Addr", listingDetails.Addr);
    request.input("StartDate", listingDetails.StartDate);
    request.input("EndDate", listingDetails.EndDate);
    request.input("CauseArea", listingDetails.CauseArea);
    request.input("Skill", listingDetails.Skill);
    request.input("Requirements", listingDetails.Requirements);
    request.input("About", listingDetails.About);
    request.input("MediaPath", listingDetails.MediaPath);

    const result = await request.query(sqlQuery);

    connection.close();
  }
  static async updateListing(listingID, updatedListing) {
    try {
      const connection = await sql.connect(dbConfig);
      const selectedListingQuery = ` 
        SELECT * 
        FROM Listing 
        WHERE ListingID = @ListingID; 
      `;

      const request = connection.request();
      request.input("ListingID", listingID);
      const selectedResultQuery = await request.query(selectedListingQuery);

      const listingQuery = ` 
        UPDATE Listing SET 
        ListingName = @ListingName, 
        Addr = @Addr, 
        StartDate = @StartDate, 
        EndDate = @EndDate, 
        CauseArea = @CauseArea, 
        Skill = @Skill, 
        Requirements = @Requirements, 
        About = @About, 
        MediaPath = @MediaPath 
        WHERE ListingID = ${selectedResultQuery.recordset[0].ListingID} 
        `;

      const listingReq = connection.request();
      listingReq.input("ListingID", selectedResultQuery.recordset[0].ListingID);
      listingReq.input("PostedBy", selectedResultQuery.recordset[0].PostedBy);

      listingReq.input(
        "ListingName",
        updatedListing[0].ListingName ||
          selectedResultQuery.recordset[0].ListingName
      );
      listingReq.input(
        "Addr",
        updatedListing[0].Addr || selectedResultQuery.recordset[0].Addr
      );
      listingReq.input(
        "StartDate",
        updatedListing[0].StartDate ||
          selectedResultQuery.recordset[0].StartDate
      );
      listingReq.input(
        "EndDate",
        updatedListing[0].EndDate || selectedResultQuery.recordset[0].EndDate
      );
      listingReq.input(
        "CauseArea",
        updatedListing[0].CauseArea ||
          selectedResultQuery.recordset[0].CauseArea
      );
      listingReq.input(
        "Skill",
        updatedListing[0].Skill || selectedResultQuery.recordset[0].Skill
      );
      listingReq.input(
        "Requirements",
        updatedListing[0].Requirements ||
          selectedResultQuery.recordset[0].Requirements
      );
      listingReq.input(
        "About",
        updatedListing[0].About || selectedResultQuery.recordset[0].About
      );
      listingReq.input(
        "MediaPath",
        updatedListing[0].MediaPath ||
          selectedResultQuery.recordset[0].MediaPath
      );

      await listingReq.query(listingQuery);
      connection.close();
      return this.getAllListings();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Listing;
