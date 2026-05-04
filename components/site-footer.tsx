import Image from "next/image";
import Link from "next/link";

import {
  FESTIVAL_NAME,
  INSTAGRAM_HANDLE,
  SOCIAL_LINKS,
} from "@/lib/config/socials";
import { COMPANY } from "@/lib/config/company";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";
import { PRIVATE_DINING_VISIBLE } from "@/lib/config/features";

const ALL_EXPLORE_LINKS = [
  { href: "/workshops", label: "Workshops" },
  { href: "/private-dining", label: "Private Dining" },
  { href: "/menu", label: "Menu" },
  { href: "/contact-us", label: "Contact" },
] as const;

const EXPLORE_LINKS = ALL_EXPLORE_LINKS.filter(
  (link) => link.href !== "/private-dining" || PRIVATE_DINING_VISIBLE,
);

const LEGAL_LINKS = [
  { href: "/toc", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund & Cancellation" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-5 sm:col-span-1">
            <Link
              href="/"
              aria-label={`${FESTIVAL_NAME} — home`}
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/assets/logo.svg"
                alt=""
                width={28}
                height={48}
                className="h-9 w-auto"
              />
              <span className="font-display text-lg tracking-tight">
                {FESTIVAL_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {eventDateFormat.range()} &middot; {CURRENT_EVENT.locationName}
            </p>

            <ul className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={name}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={SOCIAL_LINKS[0].href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>

          {/* Explore */}
          <FooterLinkColumn title="Explore" links={EXPLORE_LINKS} />

          {/* Legal */}
          <FooterLinkColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {FESTIVAL_NAME}. All rights
            reserved.
          </p>
          <p>
            Operated by {COMPANY.name} &middot; No. {COMPANY.registrationNumber}{" "}
            &middot; {COMPANY.registeredAddress}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={title} className="space-y-4">
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-foreground">
        {title}
      </h2>
      <ul className="space-y-2.5 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
