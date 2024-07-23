const Follower = require("../models/follower");

const postFollow = async (req, res) => {
  const postFollow = req.body;
  try {
    const newFollow = await Follower.postFollow(postFollow);
    res.status(201).json(newFollow);
    console.log("Successfully posted Follow");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting follow");
  }
};
const deleteFollow = async (req, res) => {
  const deleteFollow = req.body;
  try {
    const deletedFollow = await Follower.deleteFollow(deleteFollow);
    res.status(201).json(deletedFollow);
    console.log("Successfully deleted Follow");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting follow");
  }
};

module.exports = {
  postFollow,
  deleteFollow
}