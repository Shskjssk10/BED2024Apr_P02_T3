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

const getVolunteerById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const volunteer = await Volunteer.getVolunteerById(id);
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

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerProfile,
};
