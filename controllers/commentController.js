const Comment = require("../models/comment");

const getAllCommentsByPostID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const comment = await Comment.getAllCommentsByPostID(id);
    if (!comment) {
      return res.status(404).send("comment not found");
    }
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving comment");
  }
}

module.exports = {
  getAllCommentsByPostID
}