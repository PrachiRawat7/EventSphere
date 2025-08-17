import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Ticket } from "../models/ticket.model.js";
import { Events } from "../models/event.model.js";
import { v4 as uuidv4 } from "uuid"; // install with: npm install uuid
import { EventAttend } from "../models/eventAttendees.model.js";

const createTicket = asyncHandler(async (req, res) => {
  const userId = req.user._id;  // assuming req.user from auth middleware
  const { eventId } = req.body;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  // Check event exists
  const event = await Events.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if ticket already exists for this user & event
  const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
  if (existingTicket) {
    throw new ApiError(409, "You already have a ticket for this event");
  }

  // Generate QR code string (e.g., unique ID or URL)
  const qrCodeString = `ticket-${uuidv4()}`; // You can customize this

  // Create ticket
  const ticket = await Ticket.create({
    user: userId,
    event: eventId,
    qrCode: qrCodeString,
  });

  
    const eventAttendees=await EventAttend.create({
      user:userId,
      event:eventId
    });
    console.log("EventAttend record created:", eventAttendees);
  
   
  
  res.status(201).json(new ApiResponse(201, ticket, "Ticket created successfully"));
});


const getUserTickets=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    const tickets=await Ticket.find({user:userId})
    .populate("event","name date eimage")
    .exec();

    if(!tickets||(await tickets).length==0){
        throw new ApiError(404,"No tickets purchased");
    }
    res
    .status(200)
    .json(new ApiResponse(200,tickets,"Tickets fetched Succesfully"));
})

export { createTicket,getUserTickets };
