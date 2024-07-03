const Volunteer = require("../models/volunteer");
const Organisation = require("../models/organisation");

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
    try {
        const volunteer = await Volunteer.getVolunteerByUsername(username);
        const organisation = await Organisation.getOrgByName(OrgName);

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
module.exports = {
    getAllAccounts,
    getAccountByUsername
};