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

export type DiningSession = {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  price: number;
  capacity: number;
};

export type DiningDay = {
  date: Date;
  sessions: DiningSession[];
};

export const DINING_DAYS: DiningDay[] = [
  {
    date: CURRENT_EVENT.startDate,
    sessions: [
      {
        id: "PD-2026-05-16",
        title: "Private Dining Experience",
        time: "19:00",
        location: "Atelier",
        description:
          "A curated four-course tasting menu with wine pairings, set against the marina backdrop.",
        price: 120,
        capacity: 50,
      },
    ],
  },
  {
    date: CURRENT_EVENT.endDate,
    sessions: [
      {
        id: "PD-2026-05-17",
        title: "Private Dining Experience",
        time: "19:00",
        location: "Atelier",
        description:
          "Seafood-focused tasting experience featuring locally sourced Mediterranean ingredients.",
        price: 120,
        capacity: 50,
      },
    ],
  },
];

export function getDiningSessionById(id: string) {
  for (const day of DINING_DAYS) {
    for (const session of day.sessions) {
      if (session.id === id) {
        return { day, session };
      }
    }
  }
  return null;
}
