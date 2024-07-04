const Volunteer = require("../models/volunteer");

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.getAllVolunteer();
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving volunteer");
  }
};

const getVolunteerByUsername = async (req, res) => {
  const username = parseInt(req.params.username);
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

const updateVolunteerProfile = async (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedData = req.body;

  try {
    const updatedVolunteer = await Volunteer.updateVolunteerProfile(
      userId,
      updatedData
    );
    if (!updatedVolunteer) {
      return res.status(404).send("Volunteer not found");
    }
    res.json(updatedVolunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating Volunteer");
  }
};

// Caden's Part
const getAllFollowersAndFollowing = async (req, res) => {
  const id = req.params.id;
  try {
    const allFollowers = await Volunteer.getAllFollowersAndFollowing(id);
    res.status(201).json(allFollowers); 
    console.log("Successfully retrieved No. of followers!")
  } catch (error) {
      console.error(error);
      res.status(500).send("Error getting followers");
  }
}
const postFollow = async (req, res) => {
  const postFollow = req.body;
  try {
      const newFollow = await Volunteer.postFollow(postFollow);
      res.status(201).json(newFollow); 
      console.log("Successfully posted Follow")
  } catch (error) {
      console.error(error);
      res.status(500).send("Error posting follow");
  }
}
const deleteFollow = async (req, res) => {
  const deleteFollow = req.body;
  try {
      const deletedFollow = await Volunteer.deleteFollow(deleteFollow);
      res.status(201).json(deletedFollow); 
      console.log("Successfully deleted Follow")
  } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting follow");
  }
}
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
}
module.exports = {
  getAllVolunteers,
  getVolunteerByUsername,
  updateVolunteerProfile,
  getAllFollowersAndFollowing,
  postFollow,
  deleteFollow,
  postComment
};
