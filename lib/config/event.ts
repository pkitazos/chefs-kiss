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

export const DINING_DAYS = [
  {
    date: CURRENT_EVENT.startDate,
    sessions: [
      {
        title: "Daytime Session",
        time: "11:00 AM – 3:00 PM",
        description:
          "A curated four-course tasting menu with wine pairings, set against the marina backdrop.",
        price: 120,
      },
      {
        title: "Evening Session",
        time: "7:00 PM – 11:00 PM",
        description:
          "An exclusive chef's table dinner with live cooking stations and premium cocktail service.",
        price: 180,
      },
    ],
  },
  {
    date: CURRENT_EVENT.endDate,
    sessions: [
      {
        title: "Daytime Session",
        time: "11:00 AM – 3:00 PM",
        description:
          "Seafood-focused tasting experience featuring locally sourced Mediterranean ingredients.",
        price: 120,
      },
      {
        title: "Evening Session",
        time: "7:00 PM – 11:00 PM",
        description:
          "Grand finale dinner with a multi-course journey through Cyprus and beyond.",
        price: 200,
      },
    ],
  },
] as const;
