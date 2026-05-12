import { createTRPCRouter } from "../init";
import { bookingsRouter } from "./bookings";
import { checkinRouter } from "./checkin";
import { vendorsRouter } from "./vendors";
import { eventsRouter } from "./events";
import { workshopsRouter } from "./workshops";
import { waitlistRouter } from "./waitlist";
import { slotsRouter } from "./slots";
import { seatHoldsRouter } from "./seat-holds";

export const appRouter = createTRPCRouter({
  bookings: bookingsRouter,
  checkin: checkinRouter,
  vendors: vendorsRouter,
  events: eventsRouter,
  workshops: workshopsRouter,
  waitlist: waitlistRouter,
  slots: slotsRouter,
  seatHolds: seatHoldsRouter,
});

export type AppRouter = typeof appRouter;
