import type { Metadata } from "next";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconMail,
} from "@tabler/icons-react";

import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { AnimateIn } from "@/components/animate-in";
import { DashPattern } from "@/components/brand-pattern";

export const metadata: Metadata = {
  title: "Contact | Chef's Kiss Festival",
  description: "Get in touch with the Chef's Kiss team.",
};

const CONTACT_EMAIL = "info@chefskiss.com.cy";

const CONTACT_REASONS = [
  "Questions about workshop bookings (e.g., confirmation emails not received, changes to a booking)",
  "Questions about applying as a vendor or workshop host",
  "Press and media inquiries",
  "Any other general questions about the festival",
];

// TODO: confirm real social media URLs with the product owner before launch.
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com/chefskiss.cy/",
    Icon: IconBrandInstagram,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@chefskiss.cy",
    Icon: IconBrandTiktok,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/profile.php?id=61575561244802",
    Icon: IconBrandFacebook,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#edede9]">
        <DashPattern className="absolute inset-0 text-amber-400/30" />
        <div
          aria-hidden
          className="absolute -right-16 -top-16 size-64 rounded-full bg-[#457b9d]/10"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <AnimateIn>
            <SectionLabel>We&apos;d love to hear from you</SectionLabel>
            <h1 className="mt-3 font-display text-5xl tracking-tight">
              Get in touch
            </h1>
          </AnimateIn>
        </div>
      </div>

      <PageLayout className="max-w-3xl">
        <AnimateIn className="space-y-10">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you&apos;re booking a workshop, thinking about joining us as
            a vendor, or just curious about the festival, drop us a line. We
            read every email.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">
              Reasons to reach out
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {CONTACT_REASONS.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Email us</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <IconMail size={24} className="text-primary" aria-hidden="true" />
              <span className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
                {CONTACT_EMAIL}
              </span>
            </a>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Follow along</h2>
            <ul className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold tracking-tight text-foreground/80 transition-colors hover:border-primary hover:text-primary hover:bg-primary/5"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </AnimateIn>
      </PageLayout>
    </>
  );
}
