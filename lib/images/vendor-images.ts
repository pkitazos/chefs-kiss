import type { StaticImageData } from "next/image";

import bigBadWolf from "@/public/images/vendors/big-bad-wolf.jpg";
import cacioEPepe from "@/public/images/vendors/cacio-e-pepe.jpg";
import chefAvraam from "@/public/images/vendors/chef-avraam.jpg";
import chefNoel from "@/public/images/vendors/chef-noel.jpg";
import crepaland from "@/public/images/vendors/crepaland.jpg";
import gardenGourmet from "@/public/images/vendors/garden-gourmet.jpg";
import gemsFoodTruck from "@/public/images/vendors/gems-food-truck.jpg";
import germanDonner from "@/public/images/vendors/german-donner.jpg";
import hardRockCafe from "@/public/images/vendors/hard-rock-cafe.jpg";
import hbHotdogs from "@/public/images/vendors/hb-hotdogs.jpg";
import karasFishTavern from "@/public/images/vendors/karas-fish-tavern.jpg";
import kawacom from "@/public/images/vendors/kawacom.jpg";
import littleChefs from "@/public/images/vendors/little-chefs.jpg";
import maysDiner from "@/public/images/vendors/mays-diner.jpg";
import meGastronomy from "@/public/images/vendors/me-gastronomy.jpg";
import merakiTaste from "@/public/images/vendors/meraki-taste.jpg";
import midtownBistro from "@/public/images/vendors/midtown-bistro.jpg";
import mrWurst from "@/public/images/vendors/mr-wurst.jpg";
import myCookieDough from "@/public/images/vendors/my-cookie-dough.jpg";
import nikkei from "@/public/images/vendors/nikkei.jpg";
import omniEats from "@/public/images/vendors/omni-eats.jpg";
import pizzella from "@/public/images/vendors/pizzella.jpg";
import porFavor from "@/public/images/vendors/por-favor.jpg";
import regrub from "@/public/images/vendors/regrub.jpg";
import tarantula from "@/public/images/vendors/tarantula.jpg";
import tasteOfTradition from "@/public/images/vendors/taste-of-tradition.jpg";
import toGlykatzidiko from "@/public/images/vendors/to-glykatzidiko.jpg";
import toSouvlakiTouSoukri from "@/public/images/vendors/to-souvlaki-tou-soukri.jpg";
import wildEarth from "@/public/images/vendors/wild-earth.jpg";
import yozen from "@/public/images/vendors/yozen.jpg";

import { type VendorId } from "@/lib/config/menu";

export const PENDING_IMAGE = Symbol("pending-vendor-image");
export type PendingImage = typeof PENDING_IMAGE;

export const VENDOR_IMAGES = {
  "big-bad-wolf": bigBadWolf,
  "cacio-e-pepe": cacioEPepe,
  "chef-avraam": chefAvraam,
  "chef-noel": chefNoel,
  crepaland: crepaland,
  "garden-gourmet": gardenGourmet,
  "gems-food-truck": gemsFoodTruck,
  "german-donner": germanDonner,
  "hard-rock-cafe": hardRockCafe,
  "hb-hotdogs": hbHotdogs,
  "karas-fish-tavern": karasFishTavern,
  kawacom: kawacom,
  "little-chefs": littleChefs,
  "mays-diner": maysDiner,
  meGastronomy: meGastronomy,
  "meraki-taste": merakiTaste,
  "midtown-bistro": midtownBistro,
  "mr-wurst": mrWurst,
  "my-cookie-dough": myCookieDough,
  nikkei: nikkei,
  "omni-eats": omniEats,
  pizzella: pizzella,
  "por-favor": porFavor,
  regrub: regrub,
  "tarantula-fried-chicken": tarantula,
  "taste-of-tradition": tasteOfTradition,
  "to-glykatzidiko": toGlykatzidiko,
  "to-souvlaki-tou-soukri": toSouvlakiTouSoukri,
  "wild-earth": wildEarth,
  yozen: yozen,
} satisfies Record<VendorId, StaticImageData | PendingImage>;

export function getVendorImage(id: VendorId): StaticImageData | null {
  const entry = VENDOR_IMAGES[id] as StaticImageData | PendingImage;
  return entry === PENDING_IMAGE ? null : entry;
}
