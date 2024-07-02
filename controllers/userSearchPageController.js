const Volunteer = require("../models/volunteer");
const Organisation = require("../models/organisation");

const getAllAccounts = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteer();
        const organisations = await Organisation.getAllOrganisations();
        const accounts = [...volunteers, ...organisations];
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving accounts");
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

module.exports = {
    getAllAccounts,
    postFollow,
    deleteFollow
};