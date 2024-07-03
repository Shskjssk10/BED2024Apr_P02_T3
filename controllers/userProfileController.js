const Post = require("../models/post");
const Volunteer = require("../models/volunteer");

const getAccountInfo = async (req, res) => {
    const id = req.params.id;
    try {
        const allPosts = await Post.getAllPostsByAccID(id);
        const followersAndFollowing = await Volunteer.getAllFollowersAndFollowing(id);
        const info = [
            ...(Array.isArray(allPosts) ? allPosts : [allPosts]),
            ...followersAndFollowing 
        ];
        res.json(info);
    } catch (error){
        console.error(error);
        res.status(500).send("Error Retrieving Information");
    }
}

module.exports = {
    getAccountInfo
}
