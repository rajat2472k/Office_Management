const express = require("express");
const router = express.Router();
const { getUserTasks, markTaskCompleted } = require("../controllers/user-controllers");
const { verifyToken, isUser } = require("../utils/authMiddleware");

// Protect routes for users
router.use(verifyToken, isUser);

// 1️⃣ GET assigned tasks
router.get("/tasks", getUserTasks);

// 2️⃣ PATCH mark as completed
router.patch("/tasks/:id", markTaskCompleted);

module.exports = router;
