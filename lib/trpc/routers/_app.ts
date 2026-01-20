import { createTRPCRouter } from "../init";
import { vendorsRouter } from "./vendors";
import { eventsRouter } from "./events";

export const appRouter = createTRPCRouter({
  vendors: vendorsRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
