const Volunteer = require("../models/volunteer");

//Hendrik part
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.getAllVolunteer();
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving volunteer");
  }
};

const getVolunteerById = async (req, res) => {
  //get id that is input from req parameter and convert to int
  const id = parseInt(req.params.id);
  try {
    //fetch volunteer with given id
    const volunteer = await Volunteer.getVolunteerById(id);
    if (!volunteer) {
      //send 404 if volunteer not found
      return res.status(404).send("Volunteer not found");
    }
    //send volunteer data as json
    res.json(volunteer);
  } catch (error) {
    //log the error if there is
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};

const updateVolunteerProfile = async (req, res) => {
  //get id from req parameters and convert to int
  //get updated data from req body
  const userId = parseInt(req.params.id);
  const updatedData = req.body;

  try {
    //try to update volunteer with given id and updated data
    const updatedVolunteer = await Volunteer.updateVolunteerProfile(
      userId,
      updatedData
    );
    //if no volunteer with given id then 404 not found
    if (!updatedVolunteer) {
      return res.status(404).send("Volunteer not found");
    }
    //else send updated data as a json response
    res.json(updatedVolunteer);
  } catch (error) {
    //log error in console and send error 500 if update error
    console.error(error);
    res.status(500).send("Error updating Volunteer");
  }
};

const deleteVolunteer = async (req, res) => {
  //get id from req parameter and convert to int
  const id = parseInt(req.params.id);
  try {
    // Call your function to delete the volunteer
    await Volunteer.deleteVolunteer(id);
    //if successful delete
    res.status(200).send("Volunteer deleted successfully");
  } catch (error) {
    //else log the error
    console.error("Error deleting volunteer:", error);
    res.status(500).send("Error deleting volunteer");
  }
};

// Caden's Part
const getAllFollowersAndFollowing = async (req, res) => {
  const id = req.params.id;
  try {
    const allFollowers = await Volunteer.getAllFollowersAndFollowing(id);
    res.status(201).json(allFollowers);
    console.log("Successfully retrieved No. of followers!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting followers");
  }
};
const postComment = async (req, res) => {
  const postComment = req.body;
  try {
    const newComment = await Volunteer.postComment(postComment);
    res.status(201).json(newComment);
    console.log("Successfully posted Comment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting commnet");
  }
};
const getVolunteerByUsername = async (req, res) => {
  const username = req.params.username;
  console.log(username);
  try {
    const volunteer = await Volunteer.getVolunteerByUsername(username);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }
    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};

// Cheryl's part
const updateVolunteerHash = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { newPassword } = req.body;
  try {
    await Volunteer.updateVolunteerHash(userId, newPassword);
    res.status(200).send("Volunteer password updated successfully");
  } catch (error) {
    console.error("Error updating volunteer password:", error);
    res.status(500).send("Error updating volunteer password");
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  getVolunteerByUsername,
  updateVolunteerProfile,
  deleteVolunteer,
  getAllFollowersAndFollowing,
  postComment,
  updateVolunteerHash,
};
