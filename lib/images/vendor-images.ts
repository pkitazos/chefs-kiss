import type { StaticImageData } from "next/image";

import bigBadWolf from "@/public/images/vendors/big-bad-wolf.jpg";
import cacioEPepe from "@/public/images/vendors/cacio-e-pepe.jpg";
import crepaland from "@/public/images/vendors/crepaland.jpg";
import gardenGourmet from "@/public/images/vendors/garden-gourmet.jpg";
import gemsFoodTruck from "@/public/images/vendors/gems-food-truck.jpg";
import hardRockCafe from "@/public/images/vendors/hard-rock-cafe.jpg";
import karasFishTavern from "@/public/images/vendors/karas-fish-tavern.jpg";
import maysDiner from "@/public/images/vendors/mays-diner.jpg";
import merakiTastes from "@/public/images/vendors/meraki-tastes.jpg";
import midtownBistro from "@/public/images/vendors/midtown-bistro.jpg";
import mrWurst from "@/public/images/vendors/mr-wurst.jpg";
import myCookieDough from "@/public/images/vendors/my-cookie-dough.jpg";
import nikkei from "@/public/images/vendors/nikkei.jpg";
import omniEats from "@/public/images/vendors/omni-eats.jpg";
import pizzella from "@/public/images/vendors/pizzella.jpg";
import porFavor from "@/public/images/vendors/por-favor.jpg";
import regrub from "@/public/images/vendors/regrub.jpg";
import tarantula from "@/public/images/vendors/tarantula.jpg";
import toGlykatzidiko from "@/public/images/vendors/to-glykatzidiko.jpg";
import toSouvlakiTouSoukri from "@/public/images/vendors/to-souvlaki-tou-soukri.jpg";
import wildEarth from "@/public/images/vendors/wild-earth.jpg";
import yozen from "@/public/images/vendors/yozen.jpg";

import { type VendorId } from "@/lib/config/menu";

export const PENDING_IMAGE = Symbol("pending-vendor-image");
export type PendingImage = typeof PENDING_IMAGE;

export const VENDOR_IMAGES = {
  "cacio-e-pepe": cacioEPepe,
  crepaland: crepaland,
  "garden-gourmet": gardenGourmet,
  "gems-food-truck": gemsFoodTruck,
  "hard-rock-cafe": hardRockCafe,
  "mays-diner": maysDiner,
  "mr-wurst": mrWurst,
  nikkei: nikkei,
  "omni-eats": omniEats,
  pizzella: pizzella,
  "por-favor": porFavor,
  "to-glykatzidiko": toGlykatzidiko,
  "to-souvlaki-tou-soukri": toSouvlakiTouSoukri,
  "wild-earth": wildEarth,
  yozen: yozen,
  "my-cookie-dough": myCookieDough,
  "big-bad-wolf": bigBadWolf,
  "tarantula-fried-chicken": tarantula,
  "karas-fish-tavern": karasFishTavern,
  regrub: regrub,
  "midtown-bistro": midtownBistro,
  "meraki-tastes": merakiTastes,
  "zam-food-canteen": PENDING_IMAGE,
  kawacom: PENDING_IMAGE,
  "german-donner": PENDING_IMAGE,
  "roomates-streetfood": PENDING_IMAGE,
  "chef-avraam": PENDING_IMAGE,
  "chef-noel": PENDING_IMAGE,
  "taste-of-tradition": PENDING_IMAGE,
  "little-chefs": PENDING_IMAGE,
  "chefs-kiss-sliders": PENDING_IMAGE,
  "hb-hotdogs": PENDING_IMAGE,
  megastronomy: PENDING_IMAGE,
} satisfies Record<VendorId, StaticImageData | PendingImage>;

export function getVendorImage(id: VendorId): StaticImageData | null {
  const entry = VENDOR_IMAGES[id];
  return entry === PENDING_IMAGE ? null : entry;
}
