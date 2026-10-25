
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user");

const sampleUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876543211",
    role: "User",
    status: "Active",
  },
  {
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    role: "User",
    status: "Inactive",
  },
  {
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "9876543213",
    role: "User",
    status: "Active",
  },
  {
    name: "Vikash Das",
    email: "vikash@example.com",
    phone: "9876543214",
    role: "Admin",
    status: "Inactive",
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    // Avoid inserting the same sample emails repeatedly.
    for (const userData of sampleUsers) {
      await User.updateOne(
        { email: userData.email },
        { $setOnInsert: userData },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Sample users added or already exist.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
