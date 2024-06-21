const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving User");
  }
};

const updateUserProfile = async (req, res) => {
  const username = req.params.username;
  const newUpdatedData = req.body;

  try {
    const updatedUser = await User.updateUserProfile(username, newUpdatedData);
    if (!updateUserProfile) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user profile");
  }
};

module.exports = {
  getAllUsers,
  getUserByUsername,
  updateUserProfile,
};
