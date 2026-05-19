import { env } from "@/lib/env/client";

export const COMING_SOON = env.NEXT_PUBLIC_COMING_SOON;
export const EVENT_OVER = env.NEXT_PUBLIC_EVENT_OVER;
export const BOOKINGS_DISABLED = COMING_SOON || EVENT_OVER;
