
const mongoose = require("mongoose");
const User = require("../models/user");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../utils/validators");

// 1. GET /api/users - Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// 2. POST /api/users - Create a user
const createUser = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCreateUser(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const email = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const user = await User.create({
      ...req.body,
      name: req.body.name.trim(),
      email,
      phone: req.body.phone?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET /api/users/stats - Dashboard statistics
const getUserStats = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, inactiveUsers, usersAddedThisWeek] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: "Active" }),
        User.countDocuments({ status: "Inactive" }),
        User.countDocuments({
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersAddedThisWeek,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. GET /api/users/:id - Get one user
const getUserById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 5. PUT /api/users/:id - Update a user
const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { isValid, errors } = validateUpdateUser(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const updates = { ...req.body };

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      updates.email = updates.email.trim().toLowerCase();
    }

    if (updates.phone !== undefined) {
      updates.phone = updates.phone.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
    {
  returnDocument: "after",
  runValidators: true,
}
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 6. DELETE /api/users/:id - Delete a user
const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserStats,
  getUserById,
  updateUser,
  deleteUser,
};
