import mongoose from "mongoose";
import {Events} from "../models/event.model.js";
import {EventAttend} from "../models/eventAttendees.model.js";
import {Ticket} from "../models/ticket.model.js";

// Local midnight "today" in server timezone
function todayAtLocalMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function runCleanupPastEvents() {
  const cutoff = todayAtLocalMidnight();

  // Get IDs of all events strictly before today
  const pastEvents = await Events.find({ date: { $lt: cutoff } })
    .select({ _id: 1 })
    .lean();

  if (!pastEvents.length) {
    console.log(`[cleanup] No past events found before ${cutoff.toISOString()}`);
    return { events: 0, tickets: 0, attendees: 0 };
  }

  const totals = { events: 0, tickets: 0, attendees: 0 };

  for (const { _id: eventId } of pastEvents) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const t = await Ticket.deleteMany({ event: eventId }, { session });
        const a = await EventAttend.deleteMany({ eventId }, { session });
        const e = await Events.deleteOne({ _id: eventId }, { session });

        if ((e.deletedCount || 0) !== 1) {
          throw new Error(`Event ${eventId} was not deleted (maybe already removed).`);
        }

        // accumulate within the same successful txn
        totals.tickets += t.deletedCount || 0;
        totals.attendees += a.deletedCount || 0;
        totals.events += e.deletedCount || 0;
      });
    } catch (err) {
      console.error(`[cleanup] Transaction failed for event ${eventId}:`, err?.message || err);
      // no retry — move on to the next event
    } finally {
      session.endSession();
    }
  }

  console.log(`[cleanup] Deleted totals:`, totals);
  return totals;
}
