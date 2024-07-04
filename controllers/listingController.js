
const Listing = require("../models/listing");
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

const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.getAllListings();
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving listings");
    }
}
const getSignUpListingsById = async (req, res) => {
    const id = req.params.id;
    try {
        const listings = await Listing.getSignUpListingsById(id);
        if (!listings) {
            return res.status(404).send("There are no listings");
        }
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving listings");
    }
}
const getSavedListingsById = async (req, res) => {
    const id = req.params.id;
    try {
        const listings = await Listing.getSavedListingsById(id);
        if (!listings) {
            return res.status(404).send("There are no listings");
        }
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving listings");
    }
}

module.exports = {
    getOrganisationListings,
    getAllListings,
    getSignUpListingsById,
    getSavedListingsById
}

