import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";
import { env } from "@/lib/env/server";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});
