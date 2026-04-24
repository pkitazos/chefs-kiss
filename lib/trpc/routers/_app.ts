import { createTRPCRouter } from "../init";
import { bookingsRouter } from "./bookings";
import { vendorsRouter } from "./vendors";
import { eventsRouter } from "./events";
import { workshopsRouter } from "./workshops";
import { waitlistRouter } from "./waitlist";

export const appRouter = createTRPCRouter({
  bookings: bookingsRouter,
  vendors: vendorsRouter,
  events: eventsRouter,
  workshops: workshopsRouter,
  waitlist: waitlistRouter,
});

export type AppRouter = typeof appRouter;
