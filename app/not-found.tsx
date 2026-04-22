"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { buttonVariants } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

const SECONDARY_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/workshops", label: "Workshops" },
  { href: "/contact-us", label: "Contact" },
] as const;

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background">
        <motion.section
          className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionLabel>Error 404</SectionLabel>

          <h1 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl md:text-[56pt]">
            Off the menu.
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you&apos;re looking for isn&apos;t here. Let&apos;s get you
            back to something tasty.
          </p>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "cta" }),
              "mt-12 hover:scale-105 transition-transform duration-200",
            )}
          >
            Back to home
            <IconArrowRight />
          </Link>
        </motion.section>
      </main>
    </>
  );
}
