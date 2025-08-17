import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Events} from "../models/event.model.js";

import {EventAttend} from "../models/eventAttendees.model.js"; // has userId, eventId
import {Ticket} from "../models/ticket.model.js";               // has userId, eventId
import {User} from "../models/users.models.js";                   // has email
import nodemailer from "nodemailer";

const getAllEvents=asyncHandler(async(req,res)=>{
    const events=await Events.find();
   
    try {
        
        res
        .status(200)
        .json(new ApiResponse(200,{events},"Events Sent Succesfully"));
    } catch (error) {
        throw new ApiError(400,"Error while fetching event")
        
    }
})


const createEvent=(asyncHandler(async(req,res)=>{
    const {name,description,location,date,eimage}=req.body;

    if(!name||!description||!location||!date){
        throw new ApiError(400, "All fields except image are required");
    }
    const eventImage=eimage || "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg";
    const createdBy = req.user._id;

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
    throw new ApiError(400, "Event date cannot be in the past");
    }


    const newEvent = await Events.create({
    name,
    description,
    location,
    date: eventDate,
    eimage: eventImage,
    createdBy,
  });

  res
  .status(201)
  .json(new ApiResponse(201,{event:newEvent},"Event created Succesfully"));

}))



// SIMPLE admin delete: removes tickets + attendees + event, then emails attendees
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // 1) Find event (for email content)
  const event = await Events.findById(eventId).lean();
  if (!event) throw new ApiError(404, "Event not found");

  // 2) Collect attendee emails
  const regs = await EventAttend
    .find({ event: eventId }, { user: 1, _id: 0 })
    .populate("user", "email")
    .lean();

  const emails = [...new Set(
    regs.map(r => (r.user?.email || "").trim().toLowerCase()).filter(Boolean)
  )];

  // 3) Delete dependents, then the event
  const tRes= await Ticket.deleteMany({ event: eventId });
  const aRes =  await EventAttend.deleteMany({ event: eventId });
 const eRes = await Events.findByIdAndDelete(eventId);










  // 4) Notify attendees (simple nodemailer; ignore send errors)
  if (emails.length) {
     console.log("[mail] recipients:", emails);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // STARTTLS on 587
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      logger: true,  // <— log SMTP convo
    debug: true,   // <— verbose debug
    });

 try {
      await transporter.verify();

      const subject = `Event cancelled: ${event.name}`;
      const when = event.date ? new Date(event.date).toDateString() : "the scheduled date";
      const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
      const text =
`Hello,

We’re sorry to inform you that the event "${event.name}" scheduled for ${when} has been cancelled by the organizer.

If you have any questions, please reach out to support.

— EventSphere Team`;

      const results = await Promise.allSettled(
        emails.map(to => transporter.sendMail({ from, to, subject, text }))
      );
      console.log("[mail] send results:", results);
    } catch (e) {
      console.error("[mail] SMTP/send error:", e);
    }
  } else {
    console.warn("[mail] No recipients — skipping send.");
  }

  return res.status(200).json(new ApiResponse(
    200,
    {
      deletedEventId: eventId,
      counts: {
        ticketsDeleted: tRes.deletedCount || 0,
        attendeesDeleted: aRes.deletedCount || 0,
        eventsDeleted: eRes?.deletedCount || 0,
      },
    },
    "Event deleted and attendees notified"
  ));
});


export {getAllEvents,createEvent,deleteEvent};

// export const getAllEvents = async (req, res) => {
//   try {
//     const events = await Events.find(); // Just get events, no population

//     // Send back events array directly (or wrap in object)
//     res.status(200).json(events);
//   } catch (error) {
//     res.status(500).json({ message: "Unable to get events" });
//   }
// };
