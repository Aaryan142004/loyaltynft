const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config({ path: "../../.env" });

const User = require("../../server/models/User");


async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log("✅ Admin already exists.");
    process.exit();
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const admin = await User.create({
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    wallet: process.env.ADMIN_WALLET,
    role: "admin",
  });

  console.log("✅ Admin created:", admin.email);
  process.exit();
}

seedAdmin();
