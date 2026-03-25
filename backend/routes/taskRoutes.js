const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAnalytics
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// Task Routes
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Analytics Route
router.get("/analytics", authMiddleware, getAnalytics);

module.exports = router;