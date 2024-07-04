const sql = require("mssql");
const { poolPromise } = require("../dbConfig");

const getOrganisationListings = async (req, res) => {
  const accountId = req.accountId;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("accountId", sql.SmallInt, accountId)
      .query("SELECT * FROM Listing WHERE PostedBy = @accountId");

    const listings = result.recordset;
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getOrganisationListings };
