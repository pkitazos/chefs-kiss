import type { StaticImageData } from "next/image";

import boardsAndBordeaux from "@/public/images/workshops/boards-and-bordeaux.jpg";
import cocktailMaking from "@/public/images/workshops/cocktail-making.jpg";
import platesAndPaints from "@/public/images/workshops/plates-and-paints.jpg";
import potteryAndWine from "@/public/images/workshops/pottery-and-wine.jpg";
import toteDalin from "@/public/images/workshops/tote-dalin.jpg";

import { type WorkshopSlug } from "@/lib/config/workshops";

export const PENDING_IMAGE = Symbol("pending-workshop-image");
export type PendingImage = typeof PENDING_IMAGE;

export const WORKSHOP_IMAGES = {
  "boards-and-bordeaux": boardsAndBordeaux,
  "tote-dalin": toteDalin,
  "bead-and-sip": PENDING_IMAGE,
  "pottery-and-wine": potteryAndWine,
  "whiskey-and-cigar-experience": PENDING_IMAGE,
  "cocktail-making": cocktailMaking,
  "koupepia-by-cocones": PENDING_IMAGE,
  "plates-and-paints": platesAndPaints,
} satisfies Record<WorkshopSlug, StaticImageData | PendingImage>;

export function getWorkshopImage(slug: WorkshopSlug): StaticImageData | null {
  const entry = WORKSHOP_IMAGES[slug];
  return entry === PENDING_IMAGE ? null : entry;
}
