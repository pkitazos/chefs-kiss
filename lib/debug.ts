import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), ".debug.log");
const ENABLED = process.env.NODE_ENV === "development";

export function debug(tag: string, message: string, data?: unknown) {
  if (!ENABLED) return;
  const ts = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
  let line = `[${ts}] [${tag}] ${message}`;
  if (data !== undefined) {
    line += typeof data === "string" ? ` ${data}` : ` ${JSON.stringify(data)}`;
  }
  fs.appendFileSync(LOG_FILE, line + "\n");
}
