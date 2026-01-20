import { createTRPCRouter } from "../init";
import { vendorsRouter } from "./vendors";

export const appRouter = createTRPCRouter({
  vendors: vendorsRouter,
});

export type AppRouter = typeof appRouter;
