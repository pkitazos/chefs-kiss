import { defineConfig } from "drizzle-kit";
import { serverEnv } from "./lib/env";

export default defineConfig({
  out: "./lib/db/migrations",
  schema: "./lib/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: { url: serverEnv.DATABASE_URL },
  verbose: true,
  strict: true,
});
