import type { StaticImageData } from "next/image";

import r2Alphamega from "@/public/images/sponsors/r2-alphamega.png";
import r2KRSK from "@/public/images/sponsors/r2-KRSK.png";

export const SPONSOR_ROW_1: { src: string | StaticImageData; alt: string }[] = [
  { src: "/images/sponsors/r1-cablenet.svg", alt: "Cablenet" },
  { src: "/images/sponsors/r1-foody.svg", alt: "Foody" },
  { src: "/images/sponsors/r1-payabl.svg", alt: "Payabl" },
];

export const SPONSOR_ROW_2: { src: string | StaticImageData; alt: string }[] = [
  { src: "/images/sponsors/r2-serano.svg", alt: "Serano" },
  { src: "/images/sponsors/r2-shishalove.svg", alt: "Shisha Love" },
  { src: "/images/sponsors/r2-snips.svg", alt: "Snips" },
  { src: "/images/sponsors/r2-axnagal.svg", alt: "Axnagal" },
  { src: "/images/sponsors/r2-delicacy-foods.svg", alt: "Delicacy Foods" },
  { src: r2Alphamega, alt: "Alphamega" },
  { src: r2KRSK, alt: "KRSK" },
  { src: "/images/sponsors/r2-landas.svg", alt: "Landas" },
  { src: "/images/sponsors/r2-cavaway.svg", alt: "Cavaway" },
];
