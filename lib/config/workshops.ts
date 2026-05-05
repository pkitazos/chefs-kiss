import { CURRENT_EVENT } from "./event";

export type Host = {
  name: string;
  instagram?: string;
};

export type WorkshopSlot = {
  id: string;
  variantId?: string;
  time: string;
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
  shortId: string;
  title: string;
  hostedBy: Host[];
  tagline: string;
  longDescription: string;
  duration: string;
  maxSeatsPerBooking: number;
  days: WorkshopDay[];
};

const DEFAULT_MAX_SEATS_PER_BOOKING = 1;

function defineWorkshop<
  const Slug extends string,
  const ShortId extends string,
>(
  w: { slug: Slug; shortId: ShortId } & Omit<
    WorkshopConfig,
    "slug" | "shortId"
  >,
) {
  return w;
}

// Plates & Paints	@ creative___sips

export const WORKSHOPS = [
  defineWorkshop({
    slug: "boards-and-bordeaux",
    shortId: "BB",
    title: "Boards & Bordeaux",
    hostedBy: [
      {
        name: "@christal.art",
        instagram: "https://www.instagram.com/christal.art/",
      },
    ],
    tagline:
      "A relaxed paint-and-sip workshop with wine, cheese, and handmade decor.",
    longDescription:
      "Boards & Bordeaux is a relaxed, creative workshop where participants enjoy wine, cheese, and delicious accompaniments while designing and painting their own plaster board. With simple techniques and guidance from the team, each guest leaves with a unique handmade piece of décor to take home.",
    duration: "1 hour",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-BB-D1-1200",
            time: "12:00 - 13:00",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-BB-D1-1330",
            time: "13:30 - 14:30",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-BB-D1-1500",
            time: "15:00 - 16:00",
            capacity: 20,
            price: 25,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-BB-D2-1200",
            time: "12:00 - 13:00",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-BB-D2-1315",
            time: "13:15 - 14:15",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-BB-D2-1430",
            time: "14:30 - 15:30",
            capacity: 20,
            price: 25,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "tote-dalin",
    shortId: "TD",
    title: "Tote Bag Workshop",
    hostedBy: [
      {
        name: "@tote_dalin",
        instagram: "https://www.instagram.com/tote_dalin/",
      },
    ],
    tagline: "Learn textile painting and create a hand-painted tote bag.",
    longDescription:
      "The workshop introduces participants to basic textile painting techniques before guiding them through creating their own custom tote bag design. Beyond learning practical skills, they’ll enjoy a relaxed, creative experience, build confidence in their artistic expression, and leave with a unique, hand-painted tote bag they can proudly use.",
    duration: "2 hours",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-TD-D1-1400",
            time: "14:00 - 16:00",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-TD-D1-1700",
            time: "17:00 - 19:00",
            capacity: 20,
            price: 25,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-TD-D2-1400",
            time: "14:00 - 16:00",
            capacity: 20,
            price: 25,
          },
          {
            id: "WS-TD-D2-1700",
            time: "17:00 - 19:00",
            capacity: 20,
            price: 25,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "bead-and-sip",
    shortId: "BS",
    title: "Bead & Sip",
    hostedBy: [
      { name: "@lols_ies", instagram: "https://www.instagram.com/lols_ies/" },
    ],
    tagline:
      "A creative charm-making workshop designed for fun, flow, and feel-good vibes.",
    longDescription:
      "Your 20s are basically split between running marathons… or healing your inner child. We know which one we’re picking! Come hang with us at Chefs Kiss for a little sip & bead moment - where your tea is safe, your creativity runs wild, and everything gets a little more sparkly. Think: bag charms, phone charms, or anything you feel like charming. All ages welcome - leaving with a smiley is guaranteed.",
    duration: "1.5 hours",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-BS-D1-1600",
            time: "16:00 - 17:30",
            capacity: 12,
            price: 25,
          },
          {
            id: "WS-BS-D1-1830",
            time: "18:30 - 10:00",
            capacity: 12,
            price: 25,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-BS-D2-1200",
            time: "12:00 - 13:30",
            capacity: 12,
            price: 25,
          },
          {
            id: "WS-BS-D2-1500",
            time: "15:00 - 16:30",
            capacity: 12,
            price: 25,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "pottery-and-wine",
    shortId: "PW",
    title: "Pottery & Wine",
    hostedBy: [
      {
        name: "@askott.pottery",
        instagram: "https://www.instagram.com/askott.pottery/",
      },
      {
        name: "@stories.ofclay",
        instagram: "https://www.instagram.com/stories.ofclay/",
      },
      {
        name: "@cthru.store",
        instagram: "https://www.instagram.com/cthru.store/",
      },
    ],
    tagline:
      "A refined, hands‑on ceramics experience with clay, colour, and wine.",
    longDescription:
      "These relaxed, hands‑on ceramic workshops invite participants to slow down, create, and enjoy the moment through pottery or painting experiences. Whether shaping a piece from scratch or painting a mug or bowl, participants explore creativity, colour, and form in a welcoming social setting. No prior experience is needed, and all pieces are glazed, kiln‑fired, food‑safe, and shipped directly to your door.",
    duration: "1.5 hours",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-PW-D1-1830",
            time: "18:30 - 20:30",
            capacity: 15,
            price: 35,
          },
          {
            id: "WS-PW-MG-D1-1730",
            variantId: "MG",
            time: "17:30 - 19:00",
            capacity: 15,
            price: 30,
            shortDescription: "Paint Your Own - Mug Edition",
          },
          {
            id: "WS-PW-BL-D1-1730",
            variantId: "BL",
            time: "17:30 - 19:00",
            capacity: 10,
            price: 35,
            shortDescription: "Paint Your Own - Bowl Edition",
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-PW-D2-1830",
            time: "18:30 - 20:30",
            capacity: 15,
            price: 35,
          },
          {
            id: "WS-PW-MG-D2-1730",
            variantId: "MG",
            time: "17:30 - 19:00",
            capacity: 15,
            price: 30,
            shortDescription: "Paint Your Own - Mug Edition",
          },
          {
            id: "WS-PW-BL-D2-1730",
            variantId: "BL",
            time: "17:30 - 19:00",
            capacity: 10,
            price: 35,
            shortDescription: "Paint Your Own - Bowl Edition",
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "whiskey-and-cigar-experience",
    shortId: "WC",
    title: "Whiskey & Cigar Experience",
    hostedBy: [],
    tagline: "An elegant waterfront experience with whiskey and cigars.",
    longDescription:
      "Whiskey & Cigar is a relaxed tasting experience taking place at the Sundeck of Ayia Napa Marina, where participants can enjoy premium whiskey and cigars while exploring rich flavours, aromas, and pairing notes in a refined waterfront setting.",
    duration: "1 hour",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-WC-D1-1530",
            time: "15:30 - 16:30",
            capacity: 12,
            price: 20,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-WC-D2-1530",
            time: "15:30 - 16:30",
            capacity: 12,
            price: 20,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "cocktail-making",
    shortId: "CM",
    title: "Cocktail Making",
    hostedBy: [
      {
        name: "Siginia",
      },
      {
        name: "@payabl_eu",
        instagram: "https://www.instagram.com/payabl_eu/",
      },
    ],
    tagline: "An interactive cocktail-making experience by the sea.",
    longDescription:
      "Cocktail Making Workshop is an interactive experience at the Sundeck of Ayia Napa Marina, where participants learn how to craft refreshing cocktails, discover mixing techniques, and enjoy a fun, lively atmosphere by the water.",
    duration: "1 hour",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-CM-D1-1700",
            time: "17:00 - 18:00",
            capacity: 12,
            price: 20,
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-CM-D@-1700",
            time: "17:00 - 18:00",
            capacity: 12,
            price: 20,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "koupepia-by-cokones",
    shortId: "KC",
    title: "Traditional Koupepia Making",
    hostedBy: [
      {
        name: "@cokones.cyprus",
        instagram: "https://www.instagram.com/cokones.cyprus/",
      },
    ],
    tagline:
      "Roll traditional Koupepia and discover authentic Cypriot flavours.",
    longDescription:
      "Roll Your Own Koupepia by Lisko is a hands-on workshop where participants learn how to prepare and roll traditional koupepia with guidance from the Cokones Team. Guests can choose between pork mince and vegetarian/vegan sessions, enjoy an authentic culinary experience, and discover the flavours of a beloved Cypriot recipe in a fun and interactive setting.",
    duration: "45 minutes",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-KC-PK-D1-1200",
            variantId: "PK",
            time: "12:00 - 12:45",
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          {
            id: "WS-KC-VG-D1-1300",
            variantId: "VG",
            time: "13:00 - 13:45",
            capacity: 6,
            price: 25,
            shortDescription: "Vegetarian / Vegan",
          },
          {
            id: "WS-KC-PK-D1-1400",
            variantId: "PK",
            time: "14:00 - 14:45",
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          {
            id: "WS-KC-VG-D1-1615",
            variantId: "VG",
            time: "16:15 - 17:00",
            capacity: 6,
            price: 25,
            shortDescription: "Vegetarian / Vegan",
          },
          {
            id: "WS-KC-PK-D1-1715",
            variantId: "PK",
            time: "17:15 - 18:00",
            capacity: 6,
            price: 25,
            shortDescription: "Pork mince",
          },
          // {
          //   // Extra slot based on demand
          //   id: "WS-KC-VG-D1-1815",
          //   time: "18:15 - 19:00",
          //   capacity: 6,
          //   price: 25,
          // },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "plates-and-paints",
    shortId: "PP",
    title: "Plates & Paints",
    hostedBy: [
      {
        name: "@creative___sips",
        instagram: "https://www.instagram.com/creative___sips/",
      },
    ],
    tagline: "Paint your own plate while enjoying a glass of wine.",
    longDescription:
      "Plates & Paints is a relaxed 45-minute creative workshop where participants can enjoy a glass of fine wine while designing and painting their own plate. It is a fun and expressive experience designed for all skill levels, with all materials provided and no previous experience needed.",
    duration: "45 minutes",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-PP-D2-1430",
            time: "14:30 - 15:30",
            capacity: 10,
            price: 40,
          },
          {
            id: "WS-PP-D2-1600",
            time: "16:00 - 17:00",
            capacity: 10,
            price: 40,
          },
          {
            id: "WS-PP-D2-1730",
            time: "17:30 - 18:30",
            capacity: 10,
            price: 40,
          },
        ],
      },
    ],
  }),
  defineWorkshop({
    slug: "paint-and-sip",
    shortId: "PS",
    title: "Paint & Sip",
    hostedBy: [
      {
        name: "@agapiouartstudio",
        instagram: "https://www.instagram.com/agapiouartstudio/",
      },
      {
        name: "@askonartvineyard",
        instagram: "https://www.instagram.com/askonartvineyard/",
      },
    ],
    tagline:
      "Create your own set of painted coasters while enjoying a relaxed glass of wine.",
    longDescription:
      "Join us for a relaxed paint-and-sip workshop where participants will create a set of four custom coasters using acrylic paints. No experience is needed - just come, enjoy a glass of wine, and get creative while designing a unique set to take home.",
    duration: "1.5 hours",
    maxSeatsPerBooking: DEFAULT_MAX_SEATS_PER_BOOKING,
    days: [
      {
        date: CURRENT_EVENT.startDate,
        slots: [
          {
            id: "WS-PS-D1-1200",
            time: "12:00 - 13:30",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D1-1430",
            time: "14:30 - 16:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D1-1630",
            time: "16:30 - 18:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D1-1830",
            time: "18:30 - 20:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
        ],
      },
      {
        date: CURRENT_EVENT.endDate,
        slots: [
          {
            id: "WS-PS-D2-1200",
            time: "12:00 - 13:30",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D2-1430",
            time: "14:30 - 16:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D2-1630",
            time: "16:30 - 18:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
          {
            id: "WS-PS-D2-1830",
            time: "18:30 - 20:00",
            capacity: 15,
            price: 25,
            shortDescription: "Coaster painting",
          },
        ],
      },
    ],
  }),
];

export type WorkshopSlug = (typeof WORKSHOPS)[number]["slug"];
export type WorkshopShortId = (typeof WORKSHOPS)[number]["shortId"];

export function getWorkshopBySlug(slug: string) {
  return WORKSHOPS.find((w) => w.slug === slug) ?? null;
}

export function getWorkshopByShortId(shortId: string) {
  return WORKSHOPS.find((w) => w.shortId === shortId) ?? null;
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

export function formatHostNames(hosts: ReadonlyArray<Host>): string {
  return hosts.map((h) => h.name).join(" & ");
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
