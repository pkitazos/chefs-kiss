import { createTRPCRouter } from "../init";
import { vendorsRouter } from "./vendors";
import { eventsRouter } from "./events";
import { workshopsRouter } from "./workshops";

export const appRouter = createTRPCRouter({
  vendors: vendorsRouter,
  events: eventsRouter,
  workshops: workshopsRouter,
});

export type AppRouter = typeof appRouter;
