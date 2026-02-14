import localFont from "next/font/local";
import { Manrope } from "next/font/google";

/**
 * PP Neue Machina - Display/Title font
 */
export const ppNeueMachina = localFont({
  src: "../fonts/PPNeueMachina-PlainUltrabold.otf",
  variable: "--font-pp-neue-machina",
  display: "swap",
  weight: "800",
});

/**
 * Manrope - Body and heading font
 */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"], // Regular, Medium, SemiBold, Bold, Extrabold
});

/**
 * Font configuration object for easy reference
 */
export const fonts = {
  display: ppNeueMachina,
  sans: manrope,
} as const;
