const Likes = require("../models/likes");

const getAllLikesById = async (req, res) => {
  const id = req.params.id;
  try {
    const likes = await Likes.getAllLikesById(id);
    if (!likes) {
      return res.status(404).send("There are no likes");
    }
    res.json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving likes");
  }
};

const postLikeById = async (req, res) => {
  const postLike = req.body;
  try {
    const newLike = await Likes.postLikeById(postLike);
    res.status(201).json(newLike);
    console.log("Successfully posted like");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting like");
  }
};

const deleteLikesById = async (req, res) => {
  const deleteLike = req.body;
  try {
    const deletedLike = await Likes.postLikeById(deleteLike);
    res.status(201).json(deletedLike);
    console.log("Successfully deleted like");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting like");
  }
};

module.exports = {
  getAllLikesById,
  postLikeById,
  deleteLikesById,
};
