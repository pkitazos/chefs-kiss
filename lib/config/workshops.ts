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
  hostedBy: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  price: number;
  images: string[];
  maxSeatsPerBooking: number;
  days: WorkshopDay[];
};

const DEFAULT_WORKSHOP_LOCATION = "Workshop Area";
const DEFAULT_SLOT_CAPACITY = 15;
const DEFAULT_MAX_SEATS_PER_BOOKING = 4;
const DEFAULT_WORKSHOP_PRICE = 10;

export const WORKSHOPS: WorkshopConfig[] = [
  {
    slug: "boards-and-bordeaux",
    title: "BOARDS & BORDEAUX",
    hostedBy: "C(h)rystal art",
    tagline: "Wine, cheese, and creative plaster board painting",
    shortDescription:
      "A relaxed workshop where participants enjoy wine and cheese while designing and painting their own plaster board.",
    longDescription:
      "Boards & Bordeaux is a relaxed, creative workshop where participants enjoy wine, cheese, and delicious accompaniments while designing and painting their own plaster board. With simple techniques and guidance from the team, each guest leaves with a unique handmade piece of décor to take home.",
    duration: "1 hour",
    price: 25,
    images: [],
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-boards-day1-1200",
            time: "12:00 PM – 1:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day1-1315",
            time: "1:15 PM – 2:15 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day1-1445",
            time: "2:45 PM – 3:45 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day1-1600",
            time: "4:00 PM – 5:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day1-1730",
            time: "5:30 PM – 6:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day1-1900",
            time: "7:00 PM – 8:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-boards-day2-1200",
            time: "12:00 PM – 1:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day2-1315",
            time: "1:15 PM – 2:15 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day2-1445",
            time: "2:45 PM – 3:45 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day2-1600",
            time: "4:00 PM – 5:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day2-1730",
            time: "5:30 PM – 6:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-boards-day2-1900",
            time: "7:00 PM – 8:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
        ],
      },
    ],
  },
  {
    slug: "tote-dalin",
    title: "TOTE DALIN",
    hostedBy: "Alina",
    tagline: "Design and paint your own custom tote bag",
    shortDescription:
      "Learn basic textile painting techniques and create your own custom, hand-painted tote bag.",
    longDescription:
      "The workshop introduces participants to basic textile painting techniques before guiding them through creating their own custom tote bag design. Beyond learning practical skills, they’ll enjoy a relaxed, creative experience, build confidence in their artistic expression, and leave with a unique, hand-painted tote bag they can proudly use.",
    duration: "2 hours",
    price: DEFAULT_WORKSHOP_PRICE,
    images: [],
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-tote-day1-1400",
            time: "2:00 PM – 4:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-tote-day1-1700",
            time: "5:00 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-tote-day2-1400",
            time: "2:00 PM – 4:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
          },
          {
            id: "ws-tote-day2-1700",
            time: "5:00 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: DEFAULT_SLOT_CAPACITY,
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
