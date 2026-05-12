import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getEnrichedSession } from "@/lib/auth";
import { type PermissionId, userHasPermission } from "@/lib/auth/permissions";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "../db";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getEnrichedSession({
    headers: opts.req.headers,
  });

  return { session, headers: opts.req.headers, db };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause &&
      !(error.cause instanceof TRPCError)
    ) {
      return { ...shape, message: "An unexpected error occurred." };
    }
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

export function permissionProcedure(permission: PermissionId) {
  return protectedProcedure.use(({ ctx, next }) => {
    if (!userHasPermission(ctx.session.user, permission)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next();
  });
}
