import { format } from "date-fns";

export const CURRENT_EVENT = {
  name: "Chef's Kiss Festival 2026",
  locationName: "Ayia Napa Marina, Famagusta",
  locationCode: "AYN",
  startDate: new Date("2026-05-16"),
  endDate: new Date("2026-05-17"),
  vendorApplicationDeadline: new Date("2026-02-28T23:59:59"),
  workshopApplicationDeadline: new Date("2026-03-15T23:59:59"),
} as const;

export const eventDateFormat = {
  short: (date: Date) => format(date, "d MMM"),
  full: (date: Date) => format(date, "d MMMM yyyy"),
  dayName: (date: Date) => format(date, "EEEE, MMMM d"),
  range: () =>
    `${format(CURRENT_EVENT.startDate, "d")} · ${format(CURRENT_EVENT.endDate, "d MMMM yyyy")}`,
};
