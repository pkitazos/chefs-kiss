"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandInstagram,
  IconChevronDown,
  IconClock,
} from "@tabler/icons-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MainLogo } from "@/components/main-logo";
import { SiteNav } from "@/components/site-nav";
import { buttonVariants } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";
import { vendors } from "@/lib/config/menu";
import { COMING_SOON } from "@/lib/config/mode";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/config/socials";
import { WORKSHOPS } from "@/lib/config/workshops";
import { cn } from "@/lib/utils";

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

function KnifeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 137.8 909.8" className={className} aria-hidden="true">
      <path
        d="M137.8,908.7l-12.6-377.5-.7-20.5L107.5,0C39.3,13.9,22.7,53.1,22.7,53.1c-43.7,123.1-10.8,481.9-10.8,481.9l81.3-2.7,12.6,377.5,32.1-1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SpatulaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 251.6 917.8" className={className} aria-hidden="true">
      <path
        d="M145.4,50.1l-5.3,132c-.2,4.4,3.2,8,7.5,8.2,4.4.2,8-3.2,8.2-7.5l5.4-132c.2-4.4-3.2-8-7.6-8.2h-.3c-4.2,0-7.7,3.3-7.9,7.5Z"
        fill="none"
      />
      <path
        d="M200.7,50.1l-16.5,130.9c-.5,4.3,2.5,8.2,6.8,8.8,4.3.5,8.3-2.5,8.8-6.8l16.5-130.9c.5-4.3-2.5-8.3-6.8-8.8-.3,0-.7,0-1,0-3.9,0-7.3,2.9-7.8,6.9Z"
        fill="none"
      />
      <path
        d="M35,50l16.9,134c.6,4.3,4.5,7.4,8.8,6.8,4.3-.6,7.4-4.5,6.8-8.8L50.6,48c-.5-4-3.9-6.9-7.8-6.9-.3,0-.7,0-1,0-4.3.6-7.4,4.5-6.8,8.8Z"
        fill="none"
      />
      <path
        d="M90.1,50l5.8,133c.2,4.3,3.9,7.8,8.2,7.5,4.3-.2,7.7-3.9,7.5-8.2l-5.7-133c-.2-4.2-3.7-7.5-7.9-7.5-.1,0-.2,0-.3,0-4.4.2-7.7,3.9-7.5,8.2Z"
        fill="none"
      />
      <path
        d="M14.9,14.8C4.3,19-1.8,30.4.5,41.6l32.7,162c.9,4.3,2.9,8.3,5.9,11.5l69.2,74.6c1.4,1.5,3,2.8,4.7,3.9v99.6c-2.4,54.4-5.4,284.9-8.1,344.8-3.7,81.3-7,150.2-7.8,159-.9,9.9,6.8,15.5,15.9,18.7,0,0,0,0,.1,0,4.8,1.7,10,2.4,15,2.1,3.5-.2,7-.9,10.4-2.1,0,0,0,0,.1,0,9-3.2,16.8-8.8,15.9-18.7-.9-10.3-5.2-102.8-9.7-201.2-2.2-47.7-4.3-260.7-6.2-302.6v-99.6c1.7-1.1,3.2-2.3,4.6-3.8l69.3-74.6c3-3.2,5-7.2,5.9-11.5l32.7-161.9c2.3-11.3-3.8-22.6-14.5-26.9C219.1,7.9,186.1,0,125.8,0h0C65.5,0,32.4,7.9,14.9,14.8ZM209.4,43.3c4.3.6,7.4,4.5,6.8,8.8l-16.5,130.9c-.6,4.3-4.5,7.3-8.8,6.8-4.3-.6-7.3-4.5-6.8-8.8l16.5-130.9c.5-4,3.9-6.9,7.8-6.9.3,0,.7,0,1,0ZM153.6,42.5c4.4.2,7.7,3.8,7.6,8.2l-5.4,132c-.2,4.3-3.8,7.7-8.2,7.5-4.3-.2-7.7-3.8-7.5-8.2l5.3-132c.2-4.2,3.7-7.5,7.9-7.5h.3ZM105.9,49.3l5.7,133c.2,4.3-3.2,8-7.5,8.2-4.3.3-8-3.2-8.2-7.5l-5.8-133c-.2-4.3,3.2-8,7.5-8.2.1,0,.2,0,.3,0,4.2,0,7.7,3.3,7.9,7.5ZM50.6,48l16.9,134c.5,4.3-2.5,8.2-6.8,8.8-4.3.5-8.2-2.5-8.8-6.8L35,50c-.5-4.3,2.5-8.3,6.8-8.8.3,0,.7,0,1,0,3.9,0,7.3,2.9,7.8,6.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const VENDOR_NAMES = vendors.map((v) => v.name);

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

type UtensilIcon = typeof ForkIcon;

const HERO_UTENSILS: { Icon: UtensilIcon; className: string }[] = [
  // Top-left: large blue fork sweeping in
  {
    Icon: ForkIcon,
    className:
      "h-[40vh] sm:h-[55vh] md:h-[70vh] -top-[8%] -left-[5%] -rotate-[40deg] text-slate-700",
  },
  // Top-center-left: pink fork
  {
    Icon: ForkIcon,
    className:
      "h-[30vh] sm:h-[40vh] md:h-[50vh] top-[5%] left-[15%] lg:left-[10%] -rotate-[15deg] text-pink-500",
  },
  // Top-right: large amber fork
  {
    Icon: ForkIcon,
    className:
      "h-[35vh] sm:h-[50vh] md:h-[65vh] -top-[5%] right-[0%] rotate-[30deg] text-amber-500",
  },
  // Right side: knife
  {
    Icon: KnifeIcon,
    className:
      "h-[25vh] sm:h-[35vh] md:h-[50vh] top-[15%] -right-[2%] rotate-[65deg] text-sky-500",
  },
  // Bottom-right: large blue fork
  {
    Icon: ForkIcon,
    className:
      "h-[40vh] sm:h-[55vh] md:h-[70vh] -bottom-[8%] -right-[5%] rotate-[140deg] text-slate-700",
  },
  // Bottom-left: spatula
  {
    Icon: SpatulaIcon,
    className:
      "h-[30vh] sm:h-[45vh] md:h-[55vh] -bottom-[5%] -left-[3%] rotate-[25deg] text-orange-600",
  },
  // Left side: sky fork (tablet+)
  {
    Icon: ForkIcon,
    className:
      "h-[30vh] md:h-[45vh] top-[35%] -left-[4%] -rotate-[70deg] text-sky-600 hidden sm:block",
  },
  // Bottom-right accent: pink (desktop)
  {
    Icon: ForkIcon,
    className:
      "h-[20vh] md:h-[35vh] bottom-[30%] right-[8%] -rotate-[20deg] text-pink-400 opacity-70 hidden md:block",
  },
  // Mid-left accent: amber (desktop)
  {
    Icon: ForkIcon,
    className:
      "h-[20vh] md:h-[30vh] top-[50%] left-[5%] lg:left-[10%] rotate-[10deg] text-amber-400 opacity-70 hidden md:block",
  },
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
      {/* Decorative utensils — blur on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter }}
      >
        {HERO_UTENSILS.map(({ Icon, className }, i) => (
          <Icon key={i} className={cn("absolute w-auto", className)} />
        ))}
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 gap-6 sm:gap-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <MainLogo className="w-full max-w-64 sm:max-w-80 md:max-w-md lg:max-w-lg" />

        <p className="text-center text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {eventDateFormat.range()} · {CURRENT_EVENT.locationName}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Link
            href="/workshops"
            className={cn(
              buttonVariants({ variant: "soft", size: "cta" }),
              "hover:scale-105 transition-transform duration-200",
            )}
          >
            {COMING_SOON ? "Explore Workshops" : "Book a Workshop"}
          </Link>
          <Link
            href="/private-dining"
            className={cn(
              buttonVariants({ variant: "default", size: "cta" }),
              "hover:scale-105 transition-transform duration-200",
            )}
          >
            {COMING_SOON ? "Explore Private Dining" : "Reserve Private Dining"}
          </Link>
        </div>
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
      className="py-16 sm:py-24 px-4 sm:px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl md:text-[56pt] leading-none tracking-tight">
          Private Dining
        </h2>
        <SectionLabel className="mt-3 block">
          An Exclusive Culinary Experience
        </SectionLabel>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_1fr] md:gap-12">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-sky-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-white drop-shadow-sm">
                Sea &amp; Fire
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join us for an intimate dining experience crafted by renowned
              chefs. Each session features a curated multi-course menu with
              premium pairings, set in a stunning marina-side venue.
            </p>
            <Link
              href="/private-dining"
              className={cn(
                buttonVariants({ variant: "default", size: "cta" }),
                "hover:scale-105 transition-transform duration-200",
              )}
            >
              {COMING_SOON ? "Learn More" : "Reserve Your Seat"}
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   WORKSHOPS PREVIEW
   ═══════════════════════════════════════════════ */

const WORKSHOP_CARD_ACCENTS = [
  "bg-amber-500",
  "bg-pink-500",
  "bg-sky-500",
  "bg-orange-500",
  "bg-green-500",
] as const;

const WORKSHOPS_AUTO_ADVANCE_MS = 4500;
const TRANSITION_MS = 600;

function WorkshopsSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const count = WORKSHOPS.length;

  // Triple the list so we always have a buffer copy on both sides of the
  // "real" middle copy. The user always sees the middle copy in their
  // resting position; side copies are just there to animate in/out of.
  const slides = [...WORKSHOPS, ...WORKSHOPS, ...WORKSHOPS];

  // Start anchored in the middle copy (index = count) so backward nav
  // has somewhere to animate to.
  const [index, setIndex] = useState(count);
  const [isAnimating, setIsAnimating] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  // Layout measurements, updated on resize. Storing the actual pixel
  // values rather than computing from percentages is what eliminates
  // the drift: each translation step is exactly one slide's worth of
  // distance, never an approximation.

  const [slideWidth, setSlideWidth] = useState(0);
  const [gap, setGap] = useState(20);

  // Measure the viewport and derive the per-slide width from it. We do
  // this rather than reading getComputedStyle on the slides themselves
  // because the slides' own width is what we're about to SET.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () => {
      const w = window.innerWidth;
      // cardsPerView is a local variable now — we only need it to divide
      // the viewport width into slots. Once we have the per-slide pixel
      // value, nothing downstream cares how many cards are on screen.
      const cardsPerView = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      const g = w >= 640 ? 24 : 20; // matches gap-5 sm:gap-6

      setGap(g);

      const viewportWidth = viewport.clientWidth;
      const totalGap = (cardsPerView - 1) * g;
      const perSlide = (viewportWidth - totalGap) / cardsPerView;
      setSlideWidth(perSlide);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const advance = (direction: 1 | -1) => {
    setIsAnimating(true);
    setIndex((i) => i + direction);
  };

  // When a transition ends outside the middle copy, silently snap back
  // into the middle copy. Because adjacent copies are identical, the
  // user sees no change — but the next animation will start from a
  // position that has room to move in either direction.
  const handleTransitionEnd = () => {
    if (index >= count * 2) {
      setIsAnimating(false);
      setIndex(index - count);
    } else if (index < count) {
      setIsAnimating(false);
      setIndex(index + count);
    }
  };

  // After a silent reset we need to re-enable animation before the
  // next user interaction. requestAnimationFrame ensures the browser
  // has committed the new (transition-less) position before we flip
  // the flag back on.
  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => advance(1), WORKSHOPS_AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [autoPlay]);

  const handleManualNav = (direction: 1 | -1) => {
    setAutoPlay(false);
    advance(direction);
  };

  // Pixel-based translation: each step is exactly one slide width plus
  // one gap. No rounding, no accumulation, no drift.
  const translatePx = index * (slideWidth + gap);

  return (
    <motion.section
      className="py-16 sm:py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-[56pt] leading-none tracking-tight">
              Workshops
            </h2>
            <SectionLabel className="mt-3 block max-w-md">
              An exclusive chance to interact with one of your favourite brands
            </SectionLabel>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              aria-label="Previous workshops"
              onClick={() => handleManualNav(-1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/70 transition-colors hover:text-foreground hover:border-foreground/50"
            >
              <IconArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next workshops"
              onClick={() => handleManualNav(1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/70 transition-colors hover:text-foreground hover:border-foreground/50"
            >
              <IconArrowRight size={18} />
            </button>
            <Link
              href="/workshops"
              className="group ml-2 inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground/70 hover:text-foreground transition-colors sm:text-base"
            >
              See all
              <IconArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/*
           Outer wrapper: overflow-x-hidden (not overflow-hidden) so the
           scale-on-hover transform can grow vertically without being clipped.
           py-2 gives breathing room above and below for the same reason.
         */}
      <div
        ref={viewportRef}
        className="mt-10 sm:mt-14 overflow-x-hidden px-4 py-2 sm:px-6"
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translate3d(-${translatePx}px, 0, 0)`,
            transition: isAnimating
              ? `transform ${TRANSITION_MS}ms ease-in-out`
              : "none",
            // will-change hints the browser to promote this to its own
            // compositor layer, which keeps animations smooth.
            willChange: "transform",
          }}
        >
          {slides.map((workshop, i) => {
            // Colour is keyed off the ORIGINAL workshop index, not the
            // flattened position, so each workshop keeps the same accent
            // no matter which copy of the list it's currently living in.
            const originalIndex = i % count;
            const isMiddleCopy = i >= count && i < count * 2;

            return (
              <Link
                key={`${workshop.slug}-${i}`}
                href={`/workshops/${workshop.slug}`}
                // Only expose the middle copy to screen readers; the
                // side copies are visual-only buffer.
                aria-hidden={!isMiddleCopy ? true : undefined}
                tabIndex={!isMiddleCopy ? -1 : undefined}
                className="group flex shrink-0 flex-col gap-3"
                style={{
                  width: `${slideWidth}px`,
                }}
              >
                <div
                  className={cn(
                    "aspect-3/4 w-full overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]",
                    "text-center text-9xl",
                    WORKSHOP_CARD_ACCENTS[
                      originalIndex % WORKSHOP_CARD_ACCENTS.length
                    ],
                  )}
                />
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-xl tracking-tight sm:text-2xl">
                      {workshop.title}
                    </p>
                    <span className="inline-flex items-center gap-1.5 shrink-0 pt-1 text-sm font-medium text-primary">
                      <IconClock size={16} />
                      {workshop.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {workshop.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   MENU CTA
   ═══════════════════════════════════════════════ */

function MenuSection() {
  return (
    <motion.section
      className="py-16 sm:py-24 px-4 sm:px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-[56pt] leading-none tracking-tight">
          Taste the Festival
        </h2>
        <SectionLabel className="mt-3 block">
          {vendors.length} vendors &middot; Hundreds of dishes
        </SectionLabel>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          From smash burgers to handmade loukoumades — browse every vendor menu
          and plan your festival bites before you arrive.
        </p>
        <div className="mt-8 sm:mt-10">
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "default", size: "cta" }),
              "hover:scale-105 transition-transform duration-200",
            )}
          >
            Browse the Menu
            {/* todo: add little animation to the arrow */}
            <IconArrowRight />
          </Link>
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Top curve: parabola dips down at center (y = x²) */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-10 sm:h-14 md:h-20"
      >
        <path d="M0,0 Q720,120 1440,0 L1440,120 L0,120 Z" fill="#edede9" />
      </svg>

      <section className="bg-[#edede9] text-foreground py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-end justify-center gap-6 sm:gap-10 md:gap-14 mb-8 sm:mb-10">
            {[
              { src: "/assets/learn.svg", alt: "Learn", word: "Learn." },
              { src: "/assets/taste.svg", alt: "Taste", word: "Taste." },
              { src: "/assets/create.svg", alt: "Create", word: "Create." },
            ].map((item) => (
              <div
                key={item.alt}
                className="flex flex-col items-center gap-2 sm:gap-3"
              >
                <Image
                  height={100}
                  width={100}
                  src={item.src}
                  alt={item.alt}
                  className="w-16 sm:w-24 md:w-32 lg:w-36 h-auto"
                />
                <span className="text-2xl sm:text-3xl md:text-[40pt] font-display leading-tight">
                  {item.word}
                </span>
              </div>
            ))}
          </div>

          <p className="text-lg sm:text-xl text-foreground/80 max-w-xl mx-auto">
            Join hands-on culinary workshops led by acclaimed chefs.
            {/* todo: need better/longer description */}
          </p>
        </div>
      </section>

      {/* Bottom curve: inverted parabola rises at center (y = -x²) */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-10 sm:h-14 md:h-20"
      >
        <path d="M0,120 Q720,0 1440,120 L1440,0 L0,0 Z" fill="#edede9" />
      </svg>
    </motion.div>
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
      className="py-16 sm:py-24 px-4 sm:px-6 border-t border-gray-200"
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
          {eventDateFormat.range()}
        </p>
      </div>

      <iframe
        className="rounded-xl mx-auto mt-10"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.096896587421!2d33.940426576165756!3d34.97923756821617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dfd027db276487%3A0x9858cbbd7660f787!2sAyia%20Napa%20Marina!5e0!3m2!1sen!2s!4v1772445894628!5m2!1sen!2s"
        width="600"
        height="450"
        loading="lazy"
      />

      <div className="mt-10 flex justify-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base"
        >
          <IconBrandInstagram size={18} aria-hidden="true" />
          <span>
            Follow{" "}
            <span className="font-semibold text-foreground/80 group-hover:text-primary">
              {INSTAGRAM_HANDLE}
            </span>{" "}
            for updates
          </span>
        </a>
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
      <SiteNav revealOnScroll />
      <HeroSection />
      <VendorMarquee />
      <PrivateDiningSection />
      <WorkshopsSection />
      <MenuSection />
      <WorkshopCTA />
      <PhotoGallery />
      <LocationSection />
    </main>
  );
}
