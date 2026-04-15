import { CURRENT_EVENT } from "./event";

export type WorkshopSlot = {
  id: string;
  time: string;
  location: string;
  capacity: number;
};

export type WorkshopDay = {
  date: Date;
  slots: WorkshopSlot[];
};

export type WorkshopConfig = {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  price: number;
  images: string[];
  maxSeatsPerBooking: number;
  days: WorkshopDay[];
};

export const WORKSHOPS: WorkshopConfig[] = [
  {
    slug: "mediterranean-pastry",
    title: "Mediterranean Pastry Masterclass",
    tagline: "From dough to delight",
    shortDescription:
      "Learn the art of Mediterranean pastry-making with hands-on techniques from award-winning pastry chefs.",
    longDescription:
      "Dive into the world of Mediterranean pastries in this immersive workshop. You'll learn traditional techniques for crafting flaky phyllo, delicate baklava, and rustic galettes using locally sourced ingredients. Each participant gets a hands-on workstation with all tools and ingredients provided. Take home your creations and a recipe booklet to continue your pastry journey.",
    duration: "2 hours",
    price: 65,
    images: [],
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-pastry-2026-05-16-am",
            time: "10:00 AM – 12:00 PM",
            location: "Workshop Tent A",
            capacity: 20,
          },
          {
            id: "ws-pastry-2026-05-16-pm",
            time: "2:00 PM – 4:00 PM",
            location: "Workshop Tent A",
            capacity: 20,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-pastry-2026-05-17-am",
            time: "10:00 AM – 12:00 PM",
            location: "Workshop Tent A",
            capacity: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "cocktail-crafting",
    title: "Cocktail Crafting Workshop",
    tagline: "Shake, stir, sip",
    shortDescription:
      "Master the art of cocktail making with premium spirits and fresh Mediterranean botanicals.",
    longDescription:
      "Join our expert mixologists for a hands-on cocktail crafting experience. You'll learn the fundamentals of balancing flavours, proper shaking and stirring techniques, and how to use fresh herbs and citrus from the Mediterranean to elevate your drinks. Each participant will craft three signature cocktails and leave with the recipes and confidence to impress at home.",
    duration: "1.5 hours",
    price: 50,
    images: [],
    maxSeatsPerBooking: 6,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-cocktail-2026-05-16-pm",
            time: "3:00 PM – 4:30 PM",
            location: "Marina Bar",
            capacity: 16,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-cocktail-2026-05-17-am",
            time: "11:00 AM – 12:30 PM",
            location: "Marina Bar",
            capacity: 16,
          },
          {
            id: "ws-cocktail-2026-05-17-pm",
            time: "3:00 PM – 4:30 PM",
            location: "Marina Bar",
            capacity: 16,
          },
        ],
      },
    ],
  },
];

export function getWorkshopBySlug(slug: string) {
  return WORKSHOPS.find((w) => w.slug === slug) ?? null;
}

export function getWorkshopSlotById(slotId: string) {
  for (const workshop of WORKSHOPS) {
    for (const day of workshop.days) {
      for (const slot of day.slots) {
        if (slot.id === slotId) {
          return { workshop, day, slot };
        }
      }
    }
  }
  return null;
}
