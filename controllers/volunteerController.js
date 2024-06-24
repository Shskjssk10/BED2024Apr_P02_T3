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
    const user = await Volunteer.getVolunteerByUsername(username);
    if (!user) {
      return res.status(404).send("Volunteer not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};

const updateVolunteerProfile = async (req, res) => {
  const username = req.params.username;
  const newUpdatedData = req.body;

  try {
    const updatedVolunteer = await Volunteer.updateVolunteerProfile(
      username,
      newUpdatedData
    );
    if (!updateVolunteerProfile) {
      return res.status(404).send("Volunteer not found");
    }
    res.json(updatedVolunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating volunteer profile");
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteerByUsername,
  updateVolunteerProfile,
};
