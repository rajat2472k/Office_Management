const Task = require("../models/taskModel");
const User = require("../models/userModel");

// GET all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "assignedTo",
      "firstName lastName email role"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// POST create a new task
exports.createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({ error: "Assigned user not found" });
    }

    if (user.role !== "user") {
      return res.status(400).json({
        error: "Tasks can only be assigned to users with role 'user'",
      });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user._id, // the manager
    });

    await task.save();

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// manager akhil2000@gmail.com   Rajat@123
