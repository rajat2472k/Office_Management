const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const { verifyToken, isManager } = require("../utils/authMiddleware");

// ✅ Protect route with token + manager role
router.use(verifyToken, isManager);

// ✅ GET /api/manager/users — return only users with role "user"
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "firstName lastName email role"
    );
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/tasks", async (req, res) => {
  const { title, description, assignedTo } = req.body;
  try {
    const user = await User.findById(assignedTo);
    if (!user || user.role !== "user") {
      return res
        .status(400)
        .json({ error: "Can only assign tasks to users with role 'user'" });
    }
    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
    });
    await task.save();
    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: "Failed to assign task" });
  }
});

// ✅ NEW: GET /api/manager/tasks — return all tasks (with user info)
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy", "firstName lastName");
    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update Task Status Error:", err);
    res.status(500).json({ error: "Failed to update task status" });
  }
});

module.exports = router;
