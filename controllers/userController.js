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
  try {
    const user = await User.getUserByUsername();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("No such user");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.updateUserProfile();
    res.json(user);
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
