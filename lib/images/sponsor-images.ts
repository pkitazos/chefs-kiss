import type { StaticImageData } from "next/image";

import r1Siginia from "@/public/images/sponsors/r1-siginia.png";
import r2Axnagal from "@/public/images/sponsors/r2-axnagal.png";
import r2KitchenIsland from "@/public/images/sponsors/r2-kitchen-island.png";
import r2Intergaz from "@/public/images/sponsors/r2-intergaz.png";
import r3Alphamega from "@/public/images/sponsors/r3-alphamega.png";

export const SPONSOR_ROW_0 = {
  src: "/images/sponsors/r0-anm.svg",
  alt: "Ayia Napa Marina",
};

export const SPONSOR_ROW_1: { src: string | StaticImageData; alt: string }[] = [
  { src: "/images/sponsors/r1-cablenet.svg", alt: "Cablenet" },
  { src: "/images/sponsors/r1-foody.svg", alt: "Foody" },
  { src: "/images/sponsors/r1-payabl.svg", alt: "Payabl" },
  { src: r1Siginia, alt: "Siginia" },
  { src: "/images/sponsors/r1-heineken.svg", alt: "Heineken" },
  { src: "/images/sponsors/r1-g-anco.svg", alt: "G anco" },
];

export const SPONSOR_ROW_2: { src: string | StaticImageData; alt: string }[] = [
  { src: "/images/sponsors/r2-alpha-radio.svg", alt: "Alpha" },
  { src: r2Axnagal, alt: "Axnagal" },
  { src: "/images/sponsors/r2-delicacy-foods.svg", alt: "Delicacy Foods" },
  { src: r2KitchenIsland, alt: "Kitchen Island" },
  { src: "/images/sponsors/r2-serano-x-snips.svg", alt: "Serano × Snips" },
  { src: r2Intergaz, alt: "Intergaz" },
  { src: "/images/sponsors/r3-shishalove.svg", alt: "Shisha Love" },
  { src: r3Alphamega, alt: "Alphamega" },
];
