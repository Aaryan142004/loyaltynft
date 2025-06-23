const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// ✅ Load .env from /server/.env
require("dotenv").config({ path: path.resolve(__dirname, "../../server/.env") });

const User = require("../../server/models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000, // Wait longer
    });

    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log("✅ Admin already exists.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      wallet: process.env.ADMIN_WALLET,
      role: "admin",
    });

    console.log("✅ Admin created:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

seedAdmin();
