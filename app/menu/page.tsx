"use client";

import Link from "next/link";
import {
  IconArrowRight,
  IconCoffee,
  IconGrill,
  IconMeat,
  IconPepper,
  IconSalad,
} from "@tabler/icons-react";
import { vendors, type VendorAccent, type VendorIcon } from "./sample-vendors";
import { AnimateIn } from "@/components/animate-in";
import { DotsPattern } from "@/components/brand-pattern";
import { SectionLabel } from "@/components/ui/section-label";
import { PageLayout } from "@/components/page-layout";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

const ACCENT_CLASSES: Record<VendorAccent, { bg: string; text: string }> = {
  amber: { bg: "bg-amber-500/15", text: "text-amber-600" },
  pink: { bg: "bg-pink-500/15", text: "text-pink-600" },
  sky: { bg: "bg-sky-500/15", text: "text-sky-600" },
  orange: { bg: "bg-orange-500/15", text: "text-orange-600" },
  teal: { bg: "bg-teal-500/15", text: "text-teal-600" },
};

const ICON_MAP: Record<VendorIcon, ComponentType<{ size?: number; className?: string }>> = {
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
              {"Chef's Kiss"}
            </h1>
            <p className="mt-2 text-black text-pretty">
              Discover menus from our festival vendors
            </p>
          </AnimateIn>
        </div>
      </div>

      <PageLayout className="max-w-3xl">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4 px-1">
          All vendors
        </h2>
        <div className="space-y-3">
          {vendors.map((vendor, i) => {
            const a = ACCENT_CLASSES[vendor.accent];
            const Icon = ICON_MAP[vendor.icon];
            return (
              <AnimateIn
                key={vendor.id}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
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
      </PageLayout>
    </>
  );
}
