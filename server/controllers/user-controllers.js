const Task = require("../models/taskModel");

// GET /api/user/tasks — User dashboard tasks
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("createdBy", "firstName lastName email");
    res.json(tasks);
  } catch (err) {
    console.error("getUserTasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// PATCH /api/user/tasks/:id — Mark task as completed
exports.markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user._id },
      { status: "completed" },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("markTaskCompleted error:", err);
    res.status(500).json({ error: "Failed to update task status" });
  }
};
