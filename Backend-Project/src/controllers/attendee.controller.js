import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { EventAttend } from "../models/eventAttendees.model.js";

const getEventAttendees = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const attendees = await EventAttend.find({ event: eventId })
    .populate("user", "username email") // fetch name and email from user
    .exec();

  if (!attendees || attendees.length === 0) {
    throw new ApiError(404, "No attendees found for this event");
  }

  res.status(200).json(new ApiResponse(200, attendees, "Attendees fetched successfully"));
});
export {getEventAttendees};