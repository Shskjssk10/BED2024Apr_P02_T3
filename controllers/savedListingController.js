const SavedListing = require("../models/savedListing");

const getAllSavedByListingID = async (req, res) => {
  const ListingID = req.params.ListingID;
  const AccID = req.params.AccID;
  try {
    const signUp = await SavedListing.getAllSavedByListingID(AccID, ListingID);
    if (!signUp) {
      return res.status(404).send("There are no signUp");
    }
    res.json(signUp);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving signUp");
  }
};
const postSaved = async (req, res) => {
  const postSignUp = req.body;
  try {
    const newSignUp = await SavedListing.postSaved(postSignUp);
    res.status(201).json(newSignUp);
    console.log("Successfully posted sign up");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting sign up");
  }
};
const deleteSaved = async (req, res) => {
  const deleteSignUp = req.body;
  try {
    const removedSignUp = await SavedListing.deleteSaved(deleteSignUp);
    res.status(201).json(removedSignUp);
    console.log("Successfully deleted sign up");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting sign up");
  }
};

module.exports = {
  getAllSavedByListingID,
  postSaved,
  deleteSaved
}
