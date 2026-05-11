import { CURRENT_EVENT } from "./event";

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
        time: "18:00 - 21:00",
        location: "Private Dining Room",
        description:
          "A curated four-course tasting menu with wine pairings, set against the marina backdrop.",
        price: 140,
        capacity: 14,
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
