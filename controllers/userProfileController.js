const Listing = require("../models/listing");
const Post = require("../models/post");
const Volunteer = require("../models/volunteer");
const Organisation = require("../models/organisation");

const getAccountInfo = async (req, res) => {
    const id = req.params.id;
    try {
        const volunteerInformation = await Volunteer.getVolunteerById(id);        
        const allPosts = await Post.getAllPostsByAccID(id);
        const followersAndFollowing = await Volunteer.getAllFollowersAndFollowing(id);
        const signUpListings = await Listing.getSignUpListingsById(id);
        const savedListings = await Listing.getSavedListingsById(id);
        res.json({
            info: volunteerInformation,
            posts: allPosts,
            followersAndFollowing: followersAndFollowing[0],
            signUpListings: signUpListings,
            savedListings: savedListings,
        });
    } catch (error){
        console.error(error);
        res.status(500).send("Error Retrieving Information");
    }
}
const getOrganisationInfo = async (req, res) => {
    const id = req.params.id;
    try {
        const organisationInfo = await Organisation.getOrgById(id);    
        const allPosts = await Post.getAllPostsByAccID(id);
        const followersAndFollowing = await Organisation.getAllFollowersAndFollowing(id);
        const allListings = await Listing.getListingsByOrgId(id);
        res.json({
            info: organisationInfo,
            followersAndFollowing: followersAndFollowing[0],
            posts: allPosts,
            listings: allListings
        });
    } catch (error){
        console.error(error);
        res.status(500).send("Error Retrieving Information");
    }
}

module.exports = {
    getAccountInfo,
    getOrganisationInfo
}
