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
    getAllListings,
    getSignUpListingsById,
    getSavedListingsById
}