"use client";

import { IconMail } from "@tabler/icons-react";
import { motion } from "motion/react";

import { SectionLabel } from "@/components/ui/section-label";
import { SOCIAL_LINKS } from "@/lib/config/socials";

const CONTACT_EMAIL = "info@chefskiss.com.cy";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <motion.section
        className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionLabel>Contact</SectionLabel>

        <h1 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl md:text-[56pt]">
          Say hello.
        </h1>

        <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Workshop questions, vendor applications, press, whatever it is, drop
          us a line. We read every email.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="group mt-12 inline-flex items-center gap-3 font-display text-2xl tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl md:text-4xl"
        >
          <IconMail
            className="size-7 text-primary sm:size-8 md:size-9"
            aria-hidden="true"
          />
          <span className="underline decoration-transparent decoration-2 underline-offset-[0.2em] transition-colors group-hover:decoration-primary">
            {CONTACT_EMAIL}
          </span>
        </a>

        <ul className="mt-16 flex items-center gap-3">
          {SOCIAL_LINKS.map(({ name, href, Icon }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 text-foreground/60 transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </motion.section>
    </main>
  );
}
