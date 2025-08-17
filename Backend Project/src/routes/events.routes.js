import { Router } from "express";
import { getAllEvents ,createEvent,deleteEvent} from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.js";

const router = Router();

// Route to get all events (public)
router.route("/all").get(getAllEvents);
router.route("/create").post(verifyJWT,verifyAdmin,createEvent);
router.route("/:eventId").delete(verifyJWT,verifyAdmin,deleteEvent)

export default router;
