const Organisation = require("../models/organisation");
const Volunteer = require("../models/volunteer")
const Comment = require("../models/comment")

const postComment = async (req, res) => {
    const postComment = req.body;
    try {
        const newComment = await Comment.postComment(postComment);
        res.status(201).json(newComment);
        console.log("Successfully posted Comment");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting commnet");
    }
}
const getAllAccounts = async(req, res) => {
    try {
        const allVolunteer = await Volunteer.getAllVolunteer();
        const allOrganisations = await Organisation.getAllOrganisations();
        const allAccounts = [...allVolunteer, ...allOrganisations]
        res.status(200).json(allAccounts);
        console.log("Successfully retrieved all accounts");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting commnet");
    }
}

module.exports = {
    postComment,
    getAllAccounts
};