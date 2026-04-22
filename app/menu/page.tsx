"use client";

import { AnimateIn } from "@/components/animate-in";
import { DotsPattern } from "@/components/brand-pattern";
import { PageLayout } from "@/components/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { vendors, type VendorAccent, type VendorIcon } from "@/lib/config/menu";
import { cn } from "@/lib/utils";
import {
  IconChevronRight,
  IconCoffee,
  IconGrill,
  IconMeat,
  IconPepper,
  IconSalad,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ComponentType } from "react";

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
  green: {
    bg: "bg-green-500/15",
    text: "text-green-600",
    card: "bg-green-500",
  },
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

export default function MenuPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#edede9]">
        <DotsPattern className="absolute inset-0 text-gray-400" />
        <div
          aria-hidden
          className="absolute -right-10 -bottom-10 size-48 rounded-full bg-[#f4a261]/15"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <AnimateIn>
            <SectionLabel>Festival Vendors</SectionLabel>
            <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              Menu
            </h1>
            <p className="mt-2 text-black text-pretty">
              Discover menus from our festival vendors
            </p>
          </AnimateIn>
        </div>
      </div>

      <PageLayout className="max-w-7xl">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4 px-1">
          All vendors
        </h2>

        {/* Mobile: divide-y list */}
        <AnimateIn className="sm:hidden">
          <div className="divide-y">
            {vendors.map((vendor) => {
              const a = ACCENT_CLASSES[vendor.accent];
              const Icon = ICON_MAP[vendor.icon];
              return (
                <Link
                  key={vendor.id}
                  href={`/menu/${vendor.id}`}
                  className="group flex items-center gap-4 py-5 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-xl",
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
        </AnimateIn>

        {/* Desktop: grid cards */}
        <AnimateIn className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vendors.map((vendor) => {
            const a = ACCENT_CLASSES[vendor.accent];
            const Icon = ICON_MAP[vendor.icon];
            return (
              <Link
                key={vendor.id}
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
            );
          })}
        </AnimateIn>
      </PageLayout>
    </>
  );
}
