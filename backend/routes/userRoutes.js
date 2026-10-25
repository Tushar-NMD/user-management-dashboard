
const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  getUserStats,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// GET /api/users - Get all users
router.get("/", getUsers);

// POST /api/users - Create a user
router.post("/", createUser);

// GET /api/users/stats - Dashboard statistics
// Keep this route before /:id
router.get("/stats", getUserStats);

// GET /api/users/:id - Get a single user
router.get("/:id", getUserById);

// PUT /api/users/:id - Update a user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
