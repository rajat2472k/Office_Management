// server/controllers/admin-controllers.js
const User = require("../models/userModel");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
 
    if (!users || users.length === 0) {
      return res.status(404).json({ mesage: "No Users Find" });
    }
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "User role updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};
