// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole
} = require('../controllers/admin-controllers');
const { verifyToken, isAdmin } = require('../utils/authMiddleware');
const User = require("../models/userModel");

// Protect all routes - only for admins
router.use(verifyToken, isAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id', updateUserRole);
router.get("/stats/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Count users error:", err);
    res.status(500).json({ error: "Failed to count users" });
  }
});

module.exports = router;
