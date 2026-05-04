import type { StaticImageData } from "next/image";

import boardsAndBordeaux from "@/public/images/workshops/boards-and-bordeaux.jpg";
import beadAndSip from "@/public/images/workshops/bead-and-sip.jpg";
import cocktailMaking from "@/public/images/workshops/cocktail-making.jpg";
import paintAndSip from "@/public/images/workshops/paint-and-sip.jpg";
import platesAndPaints from "@/public/images/workshops/plates-and-paints.jpg";
import potteryAndWine from "@/public/images/workshops/pottery-and-wine.jpg";
import toteDalin from "@/public/images/workshops/tote-dalin.jpg";
import koupepiaByCokones from "@/public/images/workshops/koupepia-by-cokones.jpg";
import whiskeyAndCigarExperience from "@/public/images/workshops/whiskey-and-cigar-experience.jpg";

import { type WorkshopSlug } from "@/lib/config/workshops";

export const PENDING_IMAGE = Symbol("pending-workshop-image");
export type PendingImage = typeof PENDING_IMAGE;

export const WORKSHOP_IMAGES = {
  "boards-and-bordeaux": boardsAndBordeaux,
  "tote-dalin": toteDalin,
  "bead-and-sip": beadAndSip,
  "pottery-and-wine": potteryAndWine,
  "whiskey-and-cigar-experience": whiskeyAndCigarExperience,
  "cocktail-making": cocktailMaking,
  "koupepia-by-cokones": koupepiaByCokones,
  "plates-and-paints": platesAndPaints,
  "paint-and-sip": paintAndSip,
} satisfies Record<WorkshopSlug, StaticImageData | PendingImage>;

export function getWorkshopImage(slug: WorkshopSlug): StaticImageData | null {
  const entry = WORKSHOP_IMAGES[slug] as StaticImageData | PendingImage;
  return entry === PENDING_IMAGE ? null : entry;
}
