const Listing = require("../models/listing");

const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.getAllListings();
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving listings");
    }
}

module.exports = {
    getAllListings
}