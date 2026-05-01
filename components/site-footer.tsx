import Link from "next/link";

import {
  FESTIVAL_NAME,
  INSTAGRAM_HANDLE,
  SOCIAL_LINKS,
} from "@/lib/config/socials";

const FOOTER_LINKS = [
  { href: "/contact-us", label: "Contact Us" },
  { href: "/toc", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

export function SiteFooter() {
  const instagram = SOCIAL_LINKS.find((s) => s.name === "Instagram");
  const otherSocials = SOCIAL_LINKS.filter((s) => s.name !== "Instagram");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {instagram && (
            <a
              href={instagram.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/80 transition-colors hover:text-primary"
            >
              <instagram.Icon size={18} aria-hidden="true" />
              <span>{INSTAGRAM_HANDLE}</span>
            </a>
          )}
          <ul className="flex items-center gap-2">
            {otherSocials.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={name}
                  className="inline-flex size-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-primary"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {FESTIVAL_NAME}
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ href, label }) => (
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
        </div>
      </div>
    </footer>
  );
}
