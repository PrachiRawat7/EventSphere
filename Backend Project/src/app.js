 import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import cron from "node-cron";
import { runCleanupPastEvents } from "./jobs/cleanupPastEvents.js";
import nodemailer from "nodemailer";

dotenv.config();

 const app=express();
//common middleware
app.use(
  cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
  })
) 

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

//import routes

import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import eventsRouter from "./routes/events.routes.js";
import ticketsRouter from "./routes/tickets.route.js"
import adminRoutes from "./routes/admin.routes.js"

//routes
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/tickets", ticketsRouter);

app.use("/api/v1/admin",adminRoutes);



app.use(errorHandler);

app.post("/test", (req, res) => {
  console.log("Test route hit");
  res.send("It works");
});


cron.schedule("5 0 * * *", async () => {
  console.log("[cleanup] Starting daily past-events cleanup...");
  await runCleanupPastEvents();
  console.log("[cleanup] Completed.");
}, { timezone: "Asia/Kolkata" });

 export {app}
