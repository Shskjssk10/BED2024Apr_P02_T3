const Listing = require("../models/listing");
const Post = require("../models/post");
const Volunteer = require("../models/volunteer");

const getAccountInfo = async (req, res) => {
    const id = req.params.id;
    try {
        const allPosts = await Post.getAllPostsByAccID(id);
        const followersAndFollowing = await Volunteer.getAllFollowersAndFollowing(id);
        const signUpListings = await Listing.getSignUpListingsById(id);
        const savedListings = await Listing.getSavedListingsById(id);
        res.json({
            posts: allPosts,
            followersAndFollowing: followersAndFollowing[0], // Extract object from array
            signUpListings: signUpListings,
            savedListings: savedListings,
        });
    } catch (error){
        console.error(error);
        res.status(500).send("Error Retrieving Information");
    }
}

module.exports = {
    getAccountInfo
}
