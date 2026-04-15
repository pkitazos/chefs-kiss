"use client";

import { AnimateIn } from "@/components/animate-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconChevronRight,
  IconCoffee,
  IconGrill,
  IconMeat,
  IconPepper,
  IconSalad,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { vendors, type VendorAccent, type VendorIcon } from "../sample-vendors";

const ACCENT_CLASSES: Record<
  VendorAccent,
  { bg: string; text: string; card: string }
> = {
  amber: {
    bg: "bg-amber-500/15",
    text: "text-amber-600",
    card: "bg-amber-500",
  },
  pink: { bg: "bg-pink-500/15", text: "text-pink-600", card: "bg-pink-500" },
  sky: { bg: "bg-sky-500/15", text: "text-sky-600", card: "bg-sky-500" },
  orange: {
    bg: "bg-orange-500/15",
    text: "text-orange-600",
    card: "bg-orange-500",
  },
  teal: { bg: "bg-teal-500/15", text: "text-teal-600", card: "bg-teal-500" },
};

const ICON_MAP: Record<
  VendorIcon,
  ComponentType<{ size?: number; className?: string }>
> = {
  grill: IconGrill,
  meat: IconMeat,
  coffee: IconCoffee,
  salad: IconSalad,
  pepper: IconPepper,
};

export default function VendorListPreview() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-5xl space-y-20 px-4">
        <h1 className="font-display text-3xl text-center">
          Vendor List — 3 Options
        </h1>

        {/* ── OPTION A: Divide-y list ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b pb-2">
            Option A — Divide-y rows (matches private dining)
          </h2>
          <div className="mx-auto max-w-2xl">
            <div className="divide-y">
              {vendors.map((vendor) => {
                const a = ACCENT_CLASSES[vendor.accent];
                const Icon = ICON_MAP[vendor.icon];
                return (
                  <Link
                    key={vendor.id}
                    href={`/menu/${vendor.id}`}
                    className="group flex items-center gap-4 py-5 transition-colors hover:bg-muted/50 sm:rounded-lg sm:px-3"
                  >
                    <div
                      className={cn(
                        "flex size-14 shrink-0 items-center justify-center rounded-xl md:size-16",
                        a.bg,
                      )}
                    >
                      <Icon size={28} className={a.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {vendor.name}
                      </p>
                      <p className={cn("text-sm", a.text)}>{vendor.cuisine}</p>
                    </div>
                    <IconChevronRight
                      size={18}
                      className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── OPTION B: Grid cards (matches workshops) ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b pb-2">
            Option B — Grid cards (matches workshops)
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor, i) => {
              const a = ACCENT_CLASSES[vendor.accent];
              const Icon = ICON_MAP[vendor.icon];
              return (
                <AnimateIn
                  key={vendor.id}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <Link
                    href={`/menu/${vendor.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary/30 hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "flex aspect-video items-center justify-center",
                        a.card,
                      )}
                    >
                      <Icon size={48} className="text-white/40" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <p
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          a.text,
                        )}
                      >
                        {vendor.cuisine}
                      </p>
                      <p className="font-display text-xl tracking-tight">
                        {vendor.name}
                      </p>
                      <div className="mt-auto pt-3">
                        <span
                          className={cn(
                            buttonVariants({ size: "cta-md" }),
                            "pointer-events-none w-full",
                          )}
                        >
                          View Menu
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        </section>

        {/* ── OPTION C: Large rows with cuisine pill ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b pb-2">
            Option C — Large rows with cuisine pill
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {vendors.map((vendor, i) => {
              const a = ACCENT_CLASSES[vendor.accent];
              const Icon = ICON_MAP[vendor.icon];
              return (
                <AnimateIn
                  key={vendor.id}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.08,
                  }}
                >
                  <Link
                    href={`/menu/${vendor.id}`}
                    className="group flex items-center gap-5 rounded-xl border p-4 transition-colors hover:border-primary/30 hover:bg-muted/50 md:p-5"
                  >
                    <div
                      className={cn(
                        "flex size-20 shrink-0 items-center justify-center rounded-2xl md:size-24",
                        a.bg,
                      )}
                    >
                      <Icon size={36} className={a.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          a.bg,
                          a.text,
                        )}
                      >
                        {vendor.cuisine}
                      </span>
                      <p className="font-display text-xl tracking-tight md:text-2xl">
                        {vendor.name}
                      </p>
                    </div>
                    <IconArrowRight
                      size={20}
                      className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
