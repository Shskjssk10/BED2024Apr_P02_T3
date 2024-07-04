const Volunteer = require("../models/volunteer");

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
    postComment
};