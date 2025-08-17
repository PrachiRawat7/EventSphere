import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.js";
import {getEventAttendees} from "../controllers/attendee.controller.js"
import nodemailer from "nodemailer";
import { runCleanupPastEvents } from "../jobs/cleanupPastEvents.js";

const router=Router();

router.use(verifyJWT,verifyAdmin);

// router.route("/adminDashboard")
router.route("/events/:eventId/attendees").get(getEventAttendees);

router.post("/cleanup-now", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const result = await runCleanupPastEvents();
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});


// router.get("/test-email", async (req, res) => {
//   try {
//     const to = req.query.to || process.env.SMTP_USER;

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT || 587),
//       secure: false, // STARTTLS
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     });

//     await transporter.verify();
//     const info = await transporter.sendMail({
//       from: process.env.FROM_EMAIL || process.env.SMTP_USER,
//       to,
//       subject: "EventSphere test",
//       text: "If you got this, SMTP works.",
//     });

//     res.json({ ok: true, id: info.messageId, to });
//   } catch (e) {
//     res.status(500).json({ ok: false, error: String(e) });
//   }
// });
export default router;