import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env/server";
import { type PermissionId, getUserPermissions } from "./permissions";
import { isAdminEmail } from "./utils";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isAdminEmail(user.email)) {
            throw new APIError("UNAUTHORIZED", {
              message:
                "Your email is not authorized. Contact admin for access.",
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export type EnrichedSession = Omit<Session, "user"> & {
  user: Session["user"] & { permissions: PermissionId[] };
};

export async function getEnrichedSession(opts: {
  headers: Headers;
}): Promise<EnrichedSession | null> {
  const session = await auth.api.getSession(opts);
  if (!session) return null;

  const permissions = await getUserPermissions(session.user.id);
  console.log(`[RBAC] ${session.user.email}: [${permissions.join(", ")}]`);

  return { ...session, user: { ...session.user, permissions } };
}
