import mongoose from "mongoose";
import dotenv from "dotenv";
import { Events } from "./models/event.model.js"; // Adjust path if needed
import {DBName} from "./constants.js";

dotenv.config();

async function seedEvents() {
  try {
    // Connect to MongoDB using your connection string in .env
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Optional: Remove this line if you don't want to delete existing events
    // await Events.deleteMany();

    const sampleEvents = [
      {
        name: "TechFest 2025",
        description: "Annual tech showcase with workshops and demos.",
        location: "Delhi Convention Center",
        date: new Date("2025-08-15T10:00:00Z"),
        eimage: "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
        createdBy: "68889947f0daf9fe7226d9af", // Replace with a valid user ObjectId
      },
      {
        name: "Berry Harvest Meetup",
        description: "Meet local farmers and learn about berry harvest.",
        location: "Berry Hills Farm",
        date: new Date("2025-09-10T14:00:00Z"),
        eimage: "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
        createdBy: "68889947f0daf9fe7226d9af",
      },
      {
        name: "Startup Meetup",
        description: "Network with startup founders and investors.",
        location: "Bangalore Hub",
        date: new Date("2025-08-20T18:00:00Z"),
        eimage: "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
        createdBy: "68889947f0daf9fe7226d9af",
      },
    ];

    // Insert the sample events
    await Events.insertMany(sampleEvents);
    console.log("Connected to DB:", mongoose.connection.db.databaseName);
    console.log("Sample events inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
}

seedEvents();
