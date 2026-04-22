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
const DEFAULT_MAX_SEATS_PER_BOOKING = 4;
const DEFAULT_WORKSHOP_PRICE = 10;

export const WORKSHOPS: WorkshopConfig[] = [
  {
    slug: "boards-and-bordeaux",
    title: "BOARDS & BORDEAUX",
    hostedBy: "C(h)rystal art",
    tagline: "Wine, cheese, and handmade decor",
    shortDescription:
      "A relaxed paint-and-sip workshop with wine, cheese, and handmade decor.",
    longDescription:
      "Boards & Bordeaux is a relaxed, creative workshop where participants enjoy wine, cheese, and delicious accompaniments while designing and painting their own plaster board. With simple techniques and guidance from the team, each guest leaves with a unique handmade piece of decor to take home.",
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
            capacity: 20,
          },
          {
            id: "ws-boards-day1-1315",
            time: "1:15 PM – 2:15 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day1-1445",
            time: "2:45 PM – 3:45 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day1-1600",
            time: "4:00 PM – 5:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day1-1730",
            time: "5:30 PM – 6:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day1-1900",
            time: "7:00 PM – 8:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
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
            capacity: 20,
          },
          {
            id: "ws-boards-day2-1315",
            time: "1:15 PM – 2:15 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day2-1445",
            time: "2:45 PM – 3:45 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day2-1600",
            time: "4:00 PM – 5:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day2-1730",
            time: "5:30 PM – 6:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
          {
            id: "ws-boards-day2-1900",
            time: "7:00 PM – 8:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "tote-dalin",
    title: "TOTE DALIN",
    hostedBy: "Alina",
    tagline: "Learn textile painting and create a hand-painted tote bag.",
    shortDescription:
      "An introductory workshop to basic textile painting techniques where you can create and take home your own custom tote bag design.",
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
            capacity: 20,
          },
          {
            id: "ws-tote-day1-1700",
            time: "5:00 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
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
            capacity: 20,
          },
          {
            id: "ws-tote-day2-1700",
            time: "5:00 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "paint-your-own-bowl-edition",
    title: "PAINT YOUR OWN — Bowl Edition",
    hostedBy: "Olga Askoti",
    tagline:
      "A refined, hands‑on ceramics experience with clay, colour, and wine.",
    shortDescription:
      "Explore creativity, colour, and form by painting your own bowl in a welcoming social setting.",
    longDescription:
      "These relaxed, hands‑on ceramic workshops invite participants to slow down, create, and enjoy the moment through pottery or painting experiences. Whether shaping a piece from scratch or painting a mug or bowl, participants explore creativity, colour, and form in a welcoming social setting. No prior experience is needed, and all pieces are glazed, kiln‑fired, food‑safe, and shipped directly to your door.",
    duration: "1.5 hours",
    price: 35,
    images: [],
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-paint-bowl-day1-1730",
            time: "5:30 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-paint-bowl-day2-1730",
            time: "5:30 PM – 7:00 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
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
    shortDescription:
      "Join us for a relaxing sip & bead moment to create custom bag or phone charms.",
    longDescription:
      "Your 20s are basically split between running marathons… or healing your inner child. We know which one we’re picking! Come hang with us at Chefs Kiss for a little sip & bead moment - where your tea is safe, your creativity runs wild, and everything gets a little more sparkly. Think: bag charms, phone charms, or anything you feel like charming. All ages welcome - leaving with a smiley is guaranteed.",
    duration: "1.5 hours",
    price: DEFAULT_WORKSHOP_PRICE,
    images: [],
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-bead-day1-1400",
            time: "2:00 PM – 3:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
          },
          {
            id: "ws-bead-day1-1600",
            time: "4:00 PM – 5:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-bead-day2-1400",
            time: "2:00 PM – 3:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
          },
          {
            id: "ws-bead-day2-1600",
            time: "4:00 PM – 5:30 PM",
            location: DEFAULT_WORKSHOP_LOCATION,
            capacity: 10,
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
    shortDescription:
      "A relaxed tasting experience featuring premium whiskey and cigars by the waterfront.",
    longDescription:
      "Whiskey & Cigar is a relaxed tasting experience taking place at the Sundeck of Ayia Napa Marina, where participants can enjoy premium whiskey and cigars while exploring rich flavours, aromas, and pairing notes in a refined waterfront setting.",
    duration: "TBC",
    price: DEFAULT_WORKSHOP_PRICE,
    images: [],
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
    title: "Cocktail Making by Payabl.",
    hostedBy: "Payabl.",
    tagline: "An interactive cocktail-making experience by the sea.",
    shortDescription:
      "Learn to craft refreshing cocktails and discover mixing techniques in a fun, waterfront atmosphere.",
    longDescription:
      "Cocktail Making Workshop is an interactive experience at the Sundeck of Ayia Napa Marina, where participants learn how to craft refreshing cocktails, discover mixing techniques, and enjoy a fun, lively atmosphere by the water.",
    duration: "TBC",
    price: DEFAULT_WORKSHOP_PRICE,
    images: [],
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
      "Roll traditional koupepia and discover authentic Cypriot flavours.",
    shortDescription:
      "A hands-on workshop where participants learn how to prepare and roll traditional Cypriot koupepia.",
    longDescription:
      "Roll Your Own Koupepia by Lisko is a hands-on workshop where participants learn how to prepare and roll traditional koupepia with guidance from the Cokones Team. Guests can choose between pork mince and vegetarian/vegan sessions, enjoy an authentic culinary experience, and discover the flavours of a beloved Cypriot recipe in a fun and interactive setting.",
    duration: "45 minutes",
    price: 25,
    images: [],
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-koupepia-pork-day1-1200",
            time: "12:00 PM – 12:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-vegan-day1-1300",
            time: "1:00 PM – 1:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-pork-day1-1400",
            time: "2:00 PM – 2:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-vegan-day1-1615",
            time: "4:15 PM – 5:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-pork-day1-1715",
            time: "5:15 PM – 6:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            // Extra slot based on demand
            id: "ws-koupepia-vegan-day1-1815",
            time: "6:15 PM – 7:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-koupepia-pork-day2-1200",
            time: "12:00 PM – 12:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-vegan-day2-1300",
            time: "1:00 PM – 1:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-pork-day2-1400",
            time: "2:00 PM – 2:45 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-vegan-day2-1615",
            time: "4:15 PM – 5:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            id: "ws-koupepia-pork-day2-1715",
            time: "5:15 PM – 6:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
          {
            // Extra slot based on demand
            id: "ws-koupepia-vegan-day2-1815",
            time: "6:15 PM – 7:00 PM",
            location: "Workshop Area",
            capacity: 6,
          },
        ],
      },
    ],
  },
  {
    slug: "plates-and-paints",
    title: "Plates & Paints",
    hostedBy: "Creative Sips",
    tagline: "Paint your own plate while enjoying a glass of wine.",
    shortDescription:
      "A relaxed 45-minute creative workshop where participants can enjoy a glass of fine wine while designing and painting their own plate.",
    longDescription:
      "Plates & Paints is a relaxed 45-minute creative workshop where participants can enjoy a glass of fine wine while designing and painting their own plate. It is a fun and expressive experience designed for all skill levels, with all materials provided and no previous experience needed.",
    duration: "45 minutes",
    price: 40,
    images: [],
    maxSeatsPerBooking: 4,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "ws-plates-day1-1430",
            time: "2:30 PM – 3:30 PM",
            location: "Workshop Area",
            capacity: 10,
          },
          {
            id: "ws-plates-day1-1600",
            time: "4:00 PM – 5:00 PM",
            location: "Workshop Area",
            capacity: 10,
          },
          {
            id: "ws-plates-day1-1730",
            time: "5:30 PM – 6:30 PM",
            location: "Workshop Area",
            capacity: 10,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "ws-plates-day2-1430",
            time: "2:30 PM – 3:30 PM",
            location: "Workshop Area",
            capacity: 10,
          },
          {
            id: "ws-plates-day2-1600",
            time: "4:00 PM – 5:00 PM",
            location: "Workshop Area",
            capacity: 10,
          },
          {
            id: "ws-plates-day2-1730",
            time: "5:30 PM – 6:30 PM",
            location: "Workshop Area",
            capacity: 10,
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
