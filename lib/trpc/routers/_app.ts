import { createTRPCRouter } from "../init";
import { bookingsRouter } from "./bookings";
import { vendorsRouter } from "./vendors";
import { eventsRouter } from "./events";
import { workshopsRouter } from "./workshops";
import { waitlistRouter } from "./waitlist";
import { slotsRouter } from "./slots";

export const appRouter = createTRPCRouter({
  bookings: bookingsRouter,
  vendors: vendorsRouter,
  events: eventsRouter,
  workshops: workshopsRouter,
  waitlist: waitlistRouter,
  slots: slotsRouter,
});

export type AppRouter = typeof appRouter;
