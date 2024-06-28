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
        const postLike = await Volunteer.postFollow(postFollow);
        res.status(201).json(postLike); 
        console.log("Successfully posted Follow")
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting follow");
    }
}
module.exports = {
    getAllAccounts,
    postFollow
};