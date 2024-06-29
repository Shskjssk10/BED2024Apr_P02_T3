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
  const username = req.params.username;
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
  const username = req.params.username;
  const newUserData = req.body;

  try {
    const updatedVolunteer = await Volunteer.updateVolunteerProfile(
      username,
      newUserData
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

module.exports = {
  getAllVolunteers,
  getVolunteerByUsername,
  updateVolunteerProfile,
};
