const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET ALL TASKS (with filters + search)
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 5, sort } = req.query;

    let filter = { user: req.user };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let query = Task.find(filter);

    // 🔥 SORTING
    if (sort === "dueDate") query = query.sort({ dueDate: 1 });
    if (sort === "priority") query = query.sort({ priority: 1 });

    // 🔥 PAGINATION
    const skip = (page - 1) * limit;

    const tasks = await query.skip(skip).limit(Number(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ ANALYTICS (IMPORTANT)
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user });

    const completed = await Task.countDocuments({
      user: req.user,
      status: "Done"
    });

    const pending = total - completed;

    const completionRate =
      total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    res.json({
      total,
      completed,
      pending,
      completionRate
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};