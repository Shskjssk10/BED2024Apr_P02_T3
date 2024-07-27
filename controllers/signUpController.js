const SignUp = require("../models/signUp");

const getAllSignUpByListingID = async (req, res) => {
  const ListingID = req.params.ListingID;
  const AccID = req.params.AccID;
  try {
    const signUp = await SignUp.getAllSignUpByListingID(AccID, ListingID);
    if (!signUp) {
      return res.status(404).send("There are no signUp");
    }
    res.json(signUp);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving signUp");
  }
};
const postSignUp = async (req, res) => {
  const postSignUp = req.body;
  try {
    const newSignUp = await SignUp.postSignUp(postSignUp);
    res.status(201).json(newSignUp);
    console.log("Successfully posted sign up");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting sign up");
  }
};
const deleteSignUp = async (req, res) => {
  const deleteSignUp = req.body;
  try {
    const removedSignUp = await SignUp.deleteSignUp(deleteSignUp);
    res.status(201).json(removedSignUp);
    console.log("Successfully deleted sign up");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting sign up");
  }
};

module.exports = {
  getAllSignUpByListingID,
  postSignUp,
  deleteSignUp
}
