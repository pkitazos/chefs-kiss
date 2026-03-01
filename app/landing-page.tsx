"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";

import { MainLogo } from "@/components/main-logo";
import { SectionLabel } from "@/components/ui/section-label";
import { CURRENT_EVENT } from "@/lib/config/event";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/* ═══════════════════════════════════════════════
   SVG UTENSIL
   ═══════════════════════════════════════════════ */

function ForkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 109.9 907.6" className={className} aria-hidden="true">
      <path
        d="M107.9,3.4h-17.7c0,0-2.8,160.7-2.8,160.7l-16.3-2.2-1.8-124.6-16.1-2.3-3.6,128.2-21.6-.2L24.9,4.8,3.6,0,.1,200.2s-3.3,51,25.1,72.8c0,0,13.3.8,14.4,19,1.1,17.3-12.9,556-15.9,590.4-.2,2,0,4,.4,6,1.3,5.6,5,16.4,14.8,18.9,9.3,2.4,17.8-6.8,22.2-12.7,2-2.6,3.1-5.8,3.2-9.1l-5.4-584s1.8-15.3,5-19.1c3.2-3.8,38.8-11.2,43.8-59.9,5-48.6.3-219,.3-219Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const VENDOR_NAMES = [
  "Hard Rock",
  "Soukris",
  "Loukou",
  "Meze Corner",
  "Spice Trail",
  "Olive & Thyme",
  "Nikkei House",
  "The Smokepit",
];

const DINING_DAYS = [
  {
    date: "Friday, May 16",
    sessions: [
      {
        title: "Daytime Session",
        time: "11:00 AM – 3:00 PM",
        description:
          "A curated four-course tasting menu with wine pairings, set against the marina backdrop.",
        price: 120,
      },
      {
        title: "Evening Session",
        time: "7:00 PM – 11:00 PM",
        description:
          "An exclusive chef's table dinner with live cooking stations and premium cocktail service.",
        price: 180,
      },
    ],
  },
  {
    date: "Saturday, May 17",
    sessions: [
      {
        title: "Daytime Session",
        time: "11:00 AM – 3:00 PM",
        description:
          "Seafood-focused tasting experience featuring locally sourced Mediterranean ingredients.",
        price: 120,
      },
      {
        title: "Evening Session",
        time: "7:00 PM – 11:00 PM",
        description:
          "Grand finale dinner with a multi-course journey through Cyprus and beyond.",
        price: 200,
      },
    ],
  },
];

const GALLERY_ITEMS = [
  { color: "bg-slate-700", tall: true },
  { color: "bg-amber-500", tall: false },
  { color: "bg-pink-500", tall: false },
  { color: "bg-sky-500", tall: true },
  { color: "bg-magenta-500", tall: true },
  { color: "bg-orange-600", tall: false },
  { color: "bg-slate-800", tall: false },
  { color: "bg-amber-400", tall: true },
];

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */

const HERO_FORKS = [
  // Top-left: large blue fork sweeping in
  "h-[40vh] sm:h-[55vh] md:h-[70vh] -top-[8%] -left-[5%] -rotate-[40deg] text-slate-700",
  // Top-center-left: pink fork
  "h-[30vh] sm:h-[40vh] md:h-[50vh] top-[5%] left-[15%] -rotate-[15deg] text-pink-500",
  // Top-right: large amber fork
  "h-[35vh] sm:h-[50vh] md:h-[65vh] -top-[5%] right-[0%] rotate-[30deg] text-amber-500",
  // Right side: teal fork
  "h-[25vh] sm:h-[35vh] md:h-[50vh] top-[15%] -right-[2%] rotate-[65deg] text-sky-500",
  // Bottom-right: large blue fork
  "h-[40vh] sm:h-[55vh] md:h-[70vh] -bottom-[8%] -right-[5%] rotate-[140deg] text-slate-700",
  // Bottom-left: orange fork
  "h-[30vh] sm:h-[45vh] md:h-[55vh] -bottom-[5%] -left-[3%] rotate-[25deg] text-orange-600",
  // Left side: sky fork (tablet+)
  "h-[30vh] md:h-[45vh] top-[35%] -left-[4%] -rotate-[70deg] text-sky-600 hidden sm:block",
  // Bottom-right accent: pink (desktop)
  "h-[20vh] md:h-[35vh] bottom-[30%] right-[8%] -rotate-[20deg] text-pink-400 opacity-70 hidden md:block",
  // Mid-left accent: amber (desktop)
  "h-[20vh] md:h-[30vh] top-[50%] left-[5%] rotate-[10deg] text-amber-400 opacity-70 hidden md:block",
];

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blurValue = useTransform(scrollYProgress, [0, 0.5], [0, 20]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section ref={ref} className="relative h-dvh overflow-hidden bg-background">
      {/* Decorative forks — blur on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter }}
      >
        {HERO_FORKS.map((cls, i) => (
          <ForkIcon key={i} className={cn("absolute w-auto", cls)} />
        ))}
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 gap-6 sm:gap-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <MainLogo className="w-full max-w-64 sm:max-w-80 md:max-w-md lg:max-w-lg" />

        <p className="text-center text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {CURRENT_EVENT.dates} · {CURRENT_EVENT.locationName}
        </p>

        <Link
          href="#tickets"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "px-10 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200",
          )}
        >
          Get Tickets
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <IconChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   VENDOR MARQUEE
   ═══════════════════════════════════════════════ */

function VendorMarqueeGroup() {
  return (
    <div className="flex shrink-0">
      {VENDOR_NAMES.map((name) => (
        <div key={name} className="flex items-center shrink-0">
          <span className="px-5 sm:px-8 text-lg sm:text-2xl md:text-3xl font-display tracking-tight whitespace-nowrap text-foreground">
            {name}
          </span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shrink-0" />
        </div>
      ))}
    </div>
  );
}

function VendorMarquee() {
  return (
    <section className="marquee-container py-6 sm:py-10 overflow-hidden border-y border-border bg-background">
      <div className="marquee-track flex w-max">
        <VendorMarqueeGroup />
        <VendorMarqueeGroup />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PRIVATE DINING
   ═══════════════════════════════════════════════ */

function PrivateDiningSection() {
  return (
    <motion.section
      id="tickets"
      className="py-16 sm:py-24 px-4 sm:px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-3xl mx-auto">
        <SectionLabel className="mb-3 block">Private Dining</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-[40pt] font-display leading-tight mb-12 sm:mb-16">
          An Exclusive
          <br />
          Culinary Experience
        </h2>

        <div className="space-y-10 sm:space-y-14">
          {DINING_DAYS.map((day) => (
            <div key={day.date}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground shrink-0">
                  {day.date}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="divide-y divide-border border-y border-border">
                {day.sessions.map((session) => (
                  <div
                    key={session.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 sm:py-6 px-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-base sm:text-lg">
                        {session.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {session.time}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        {session.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <span className="text-xl sm:text-2xl font-bold text-foreground">
                        €{session.price}
                      </span>
                      <button
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "px-6",
                        )}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   WORKSHOP CTA
   ═══════════════════════════════════════════════ */

function WorkshopCTA() {
  return (
    <motion.section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-secondary text-secondary-foreground"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel className="mb-3 block text-secondary-foreground/60">
          Workshops
        </SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-[40pt] font-display leading-tight mb-4 sm:mb-6">
          Learn. Taste. Create.
        </h2>
        <p className="text-lg sm:text-xl text-secondary-foreground/80 max-w-xl mx-auto mb-8 sm:mb-10">
          Join hands-on culinary workshops led by acclaimed chefs. From pasta
          making to molecular gastronomy — find your next skill.
        </p>
        <Link
          href="/workshops/book"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "px-10 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200",
          )}
        >
          Book Your Workshop
        </Link>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   PHOTO GALLERY
   ═══════════════════════════════════════════════ */

function PhotoGallery() {
  return (
    <motion.section
      className="py-16 sm:py-24 px-4 sm:px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="mb-3 block">Gallery</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-[40pt] font-display leading-tight mb-10 sm:mb-14">
          A Feast for the Eyes
        </h2>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className={cn(
                "mb-3 sm:mb-4 rounded-2xl overflow-hidden break-inside-avoid",
                "hover:scale-[1.03] transition-transform duration-300 cursor-pointer",
                item.color,
                item.tall ? "aspect-3/4" : "aspect-4/3",
              )}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   LOCATION
   ═══════════════════════════════════════════════ */

function LocationSection() {
  return (
    <motion.section
      className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel className="mb-3 block">Location</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-[40pt] font-display leading-tight mb-4">
          Find Us
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground">
          {CURRENT_EVENT.locationName}
        </p>
        <p className="text-base text-muted-foreground mt-2">
          {CURRENT_EVENT.dates}
        </p>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <VendorMarquee />
      <PrivateDiningSection />
      <WorkshopCTA />
      <PhotoGallery />
      <LocationSection />
    </main>
  );
}
