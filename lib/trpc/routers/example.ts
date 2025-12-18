import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "World"}!`,
      };
    }),

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return {
      message: `Welcome ${ctx.session.user.name}! This is a protected message.`,
    };
  }),
});
