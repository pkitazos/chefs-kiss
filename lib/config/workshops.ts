import { CURRENT_EVENT } from "./event";

export type WorkshopSlot = {
  id: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  shortDescription?: string;
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
  longDescription: string;
  duration: string;
  image: string;
  maxSeatsPerBooking: number;
  days: WorkshopDay[];
};

const DEFAULT_WORKSHOP_LOCATION = "TBC";
const DEFAULT_MAX_SEATS_PER_BOOKING = 6;
const DEFAULT_WORKSHOP_PRICE = " TBC";

export const WORKSHOPS: WorkshopConfig[] = [
  {
    slug: "boards-and-bordeaux",
    title: "Boards & Bordeaux",
    hostedBy: "C(h)rystal art",
    tagline:
      "A relaxed paint-and-sip workshop with wine, cheese, and handmade decor.",
    longDescription:
      "Boards & Bordeaux is a relaxed, creative workshop where participants enjoy wine, cheese, and delicious accompaniments while designing and painting their own plaster board. With simple techniques and guidance from the team, each guest leaves with a unique handmade piece of décor to take home.",
    duration: "1 hour",
    image: "/workshops/boards-and-bordeaux.jpg",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-boards-day1-1200",
            time: "12:00 – 13:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day1-1315",
            time: "13:15 – 14:15",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day1-1445",
            time: "14:45 – 15:45",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day1-1600",
            time: "16:00 – 17:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day1-1730",
            time: "17:30 – 18:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day1-1900",
            time: "19:00 – 20:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-boards-day2-1200",
            time: "12:00 – 13:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day2-1315",
            time: "13:15 – 14:15",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day2-1445",
            time: "14:45 – 15:45",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day2-1600",
            time: "16:00 – 17:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day2-1730",
            time: "17:30 – 18:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
          {
            id: "ws-boards-day2-1900",
            time: "19:00 – 20:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: 25,
          },
        ],
      },
    ],
  },
  {
    slug: "tote-dalin",
    title: "Tote Dalin",
    hostedBy: "Alina",
    tagline: "Learn textile painting and create a hand-painted tote bag.",
    longDescription:
      "The workshop introduces participants to basic textile painting techniques before guiding them through creating their own custom tote bag design. Beyond learning practical skills, they’ll enjoy a relaxed, creative experience, build confidence in their artistic expression, and leave with a unique, hand-painted tote bag they can proudly use.",
    duration: "2 hours",
    image: "/workshops/tote-dalin.jpg",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-tote-day1-1400",
            time: "14:00 – 16:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
          {
            id: "ws-tote-day1-1700",
            time: "17:00 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-tote-day2-1400",
            time: "14:00 – 16:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
          {
            id: "ws-tote-day2-1700",
            time: "17:00 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
        ],
      },
    ],
  },
  {
    slug: "bead-and-sip",
    title: "Bead & Sip",
    hostedBy: "Lolsies",
    tagline:
      "A creative charm-making workshop designed for fun, flow, and feel-good vibes.",
    longDescription:
      "Your 20s are basically split between running marathons… or healing your inner child. We know which one we’re picking! Come hang with us at Chefs Kiss for a little sip & bead moment - where your tea is safe, your creativity runs wild, and everything gets a little more sparkly. Think: bag charms, phone charms, or anything you feel like charming. All ages welcome - leaving with a smiley is guaranteed.",
    duration: "1.5 hours",
    image: "",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-bead-day1-1400",
            time: "14:00 – 15:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
          {
            id: "ws-bead-day1-1600",
            time: "16:00 – 17:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-bead-day2-1400",
            time: "14:00 – 15:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
          {
            id: "ws-bead-day2-1600",
            time: "16:00 – 17:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: DEFAULT_WORKSHOP_PRICE as unknown as number,
          },
        ],
      },
    ],
  },
  {
    slug: "pottery-and-wine",
    title: "Pottery & Wine",
    hostedBy: "Olga Askoti",
    tagline:
      "A refined, hands‑on ceramics experience with clay, colour, and wine.",
    longDescription:
      "These relaxed, hands‑on ceramic workshops invite participants to slow down, create, and enjoy the moment through pottery or painting experiences. Whether shaping a piece from scratch or painting a mug or bowl, participants explore creativity, colour, and form in a welcoming social setting. No prior experience is needed, and all pieces are glazed, kiln‑fired, food‑safe, and shipped directly to your door.",
    duration: "1.5 hours",
    image: "/workshops/pottery-and-wine.jpg",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-paint-day1-18:30",
            time: "18:30 - 20:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 15,
            price: 35,
          },
          {
            id: "ws-paint-mug-day1-1730",
            time: "17:30 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 15,
            price: 30,
            shortDescription: "Paint Your Own — Mug Edition",
          },
          {
            id: "ws-paint-bowl-day1-1730",
            time: "17:30 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: 35,
            shortDescription: "Paint Your Own — Bowl Edition",
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-paint-day2-18:30",
            time: "18:30 - 20:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 15,
            price: 35,
          },
          {
            id: "ws-paint-mug-day2-1730",
            time: "17:30 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 15,
            price: 30,
            shortDescription: "Paint Your Own — Mug Edition",
          },
          {
            id: "ws-paint-bowl-day2-1730",
            time: "17:30 – 19:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: 35,
            shortDescription: "Paint Your Own — Bowl Edition",
          },
        ],
      },
    ],
  },
  {
    slug: "whiskey-and-cigar-experience",
    title: "Whiskey & Cigar Experience",
    hostedBy: "Cavaway",
    tagline: "An elegant waterfront experience with whiskey and cigars.",
    longDescription:
      "Whiskey & Cigar is a relaxed tasting experience taking place at the Sundeck of Ayia Napa Marina, where participants can enjoy premium whiskey and cigars while exploring rich flavours, aromas, and pairing notes in a refined waterfront setting.",
    duration: "TBC",
    image: "",
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [],
      },
    ],
  },
  {
    slug: "cocktail-making",
    title: "Cocktail Making",
    hostedBy: "Payabl.",
    tagline: "An interactive cocktail-making experience by the sea.",
    longDescription:
      "Cocktail Making Workshop is an interactive experience at the Sundeck of Ayia Napa Marina, where participants learn how to craft refreshing cocktails, discover mixing techniques, and enjoy a fun, lively atmosphere by the water.",
    duration: "TBC",
    image: "/workshops/cocktail-making.jpg",
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [],
      },
    ],
  },
  {
    slug: "koupepia-by-cocones",
    title: "Koupepia",
    hostedBy: "Cocones",
    tagline:
      "Roll traditional Koupepia and discover authentic Cypriot flavours.",
    longDescription:
      "Roll Your Own Koupepia by Lisko is a hands-on workshop where participants learn how to prepare and roll traditional koupepia with guidance from the Cokones Team. Guests can choose between pork mince and vegetarian/vegan sessions, enjoy an authentic culinary experience, and discover the flavours of a beloved Cypriot recipe in a fun and interactive setting.",
    duration: "45 minutes",
    image: "",
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-koupepia-pork-day1-1200",
            time: "12:00 – 12:45",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          {
            id: "ws-koupepia-vegan-day1-1300",
            time: "13:00 – 13:45",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 6,
            price: 25,
            shortDescription: "Vegetarian / Vegan",
          },
          {
            id: "ws-koupepia-pork-day1-1400",
            time: "14:00 – 14:45",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          {
            id: "ws-koupepia-vegan-day1-1615",
            time: "16:15 – 17:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 6,
            price: 25,
            shortDescription: "Vegetarian / Vegan",
          },
          {
            id: "ws-koupepia-pork-day1-1715",
            time: "17:15 – 18:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          // {
          //   // Extra slot based on demand
          //   id: "ws-koupepia-vegan-day1-1815",
          //   time: "18:15 – 19:00",
          //   location: DEFAULT_WORKSHOP_LOCATION,
          //   capacity: 6,
          //   price: 25,
          // },
        ],
      },
    ],
  },
  {
    slug: "plates-and-paints",
    title: "Plates & Paints",
    hostedBy: "Creative Sips",
    tagline: "Paint your own plate while enjoying a glass of wine.",
    longDescription:
      "Plates & Paints is a relaxed 45-minute creative workshop where participants can enjoy a glass of fine wine while designing and painting their own plate. It is a fun and expressive experience designed for all skill levels, with all materials provided and no previous experience needed.",
    duration: "45 minutes",
    image: "/workshops/plates-and-paints.jpg",
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-plates-day1-1430",
            time: "14:30 – 15:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: 40,
          },
          {
            id: "ws-plates-day1-1600",
            time: "16:00 – 17:00",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: 40,
          },
          {
            id: "ws-plates-day1-1730",
            time: "17:30 – 18:30",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
            price: 40,
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

export function getWorkshopPriceSummary(
  workshop: WorkshopConfig,
): { min: number; varies: boolean } | null {
  let min: number | null = null;
  let varies = false;

  for (const day of workshop.days) {
    for (const slot of day.slots) {
      if (min === null) {
        min = slot.price;
      } else {
        if (slot.price !== min) varies = true;
        if (slot.price < min) min = slot.price;
      }
    }
  }

  return min === null ? null : { min, varies };
}
