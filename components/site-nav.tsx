"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/workshops", label: "Workshops" },
  { href: "/private-dining", label: "Private Dining" },
] as const;

const REVEAL_SCROLL_THRESHOLD = 40;

export function SiteNav({
  revealOnScroll = false,
}: {
  revealOnScroll?: boolean;
}) {
  const pathname = usePathname();
  const [revealed, setRevealed] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll) return;
    const update = () => setRevealed(window.scrollY > REVEAL_SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [revealOnScroll]);

  return (
    <header
      className={cn(
        "pointer-events-none fixed left-1/2 top-3 z-40 -translate-x-1/2 sm:top-4",
        revealOnScroll &&
          "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
        revealOnScroll && !revealed && "-translate-y-6 opacity-0",
      )}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/60 bg-background/75 px-1.5 py-1.5 shadow-lg backdrop-blur-md sm:gap-1.5 sm:px-2 sm:py-2">
        <Link
          href="/"
          aria-label="Chef's Kiss — home"
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 sm:size-9"
        >
          <Image
            src="/assets/logo.svg"
            alt=""
            width={20}
            height={34}
            className="h-5 w-auto sm:h-6"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="flex items-center">
          {LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors sm:px-4 sm:text-sm",
                  isActive
                    ? "bg-amber-600 text-background"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
