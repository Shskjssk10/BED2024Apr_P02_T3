const sql = require("mssql");
const dbConfig = require("../dbConfig");

const getOrganisationListings = async (req, res) => {
  const accountId = req.accountId;

  try {
    const connection = await sql.connect(dbConfig);
    const listingSqlQuery = `SELECT * FROM Listing WHERE PostedBy = @accountId`;
    const request = connection.request();
    request.input("accountId", sql.SmallInt, accountId);
    const result = await request.query(listingSqlQuery);

    const listings = result.recordset;
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getOrganisationListings };
