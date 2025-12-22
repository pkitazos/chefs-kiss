import { createTRPCRouter } from "../init";
import { exampleRouter } from "./example";
import { vendorsRouter } from "./vendors";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  vendors: vendorsRouter,
});

export type AppRouter = typeof appRouter;
