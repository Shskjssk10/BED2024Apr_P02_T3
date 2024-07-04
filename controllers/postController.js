const Post = require("../models/post");

const getAllPostsByAccID = async (req, res) => {
    const id = req.params.id;
    try {
        const posts = await Post.getAllPostsByAccID(id);
        if (!posts) {
            return res.status(404).send("There are no posts");
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
}

module.exports = {
    getAllPostsByAccID
}