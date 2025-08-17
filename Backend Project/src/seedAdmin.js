import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./models/users.models.js";
import { DBName } from "./constants.js";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`);
    console.log("Connected to DB");

    // Delete any existing admin users
    await User.deleteMany({ role: "admin" });
    console.log("Deleted existing admin users");

    const plainPassword = "AdminHun123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminUser = new User({
      username: "admin",
      email: "admin@gmaill.com",
      fullname: "Admin User",
      password: plainPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
