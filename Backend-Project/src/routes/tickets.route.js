import { Router } from "express";
import { createTicket,getUserTickets } from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // your auth middleware

const router = Router();

// Create ticket (protected route)
router.post("/", verifyJWT, createTicket);

// (Optional) Add routes to get tickets for user later

router.get("/", verifyJWT, getUserTickets);

export default router;
