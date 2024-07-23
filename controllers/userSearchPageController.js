const Volunteer = require("../models/volunteer");
const Organisation = require("../models/organisation");
const Follower = require("../models/follower")

const getAllAccounts = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteer();
        console.log(volunteers);
        const organisations = await Organisation.getAllOrganisations();
        const accounts = [...volunteers, ...organisations];
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving accounts");
    }
} 

const getAccountByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const volunteer = await Volunteer.getVolunteerByUsername(username);
        const organisation = await Organisation.getOrgByName(username);

        if (volunteer) {
            res.json(volunteer);
        }
        else if (organisation) {
            res.json(organisation);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving account");
    }
}
const getAllFollowerRelations = async (req, res) => {
    try {
        const allFollowRelations = await Follower.getAllFollowerRelations();
        res.json(allFollowRelations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving follow relations");
    }
}
const getFollowersByID = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const allFollowRelations = await Follower.getFollowersByID(id);
        res.json(allFollowRelations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving follow relations");
    }
}
module.exports = {
    getAllAccounts,
    getAccountByUsername, 
    getAllFollowerRelations,
    getFollowersByID
};