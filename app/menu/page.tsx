"use client";

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { vendors } from "./sample-vendors";

export default function HomePage() {
  return <VendorList />;
}

function VendorList() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── HERO BANNER ─── */}
      <div className="relative w-full h-52 md:h-72 bg-vendor-image-bg overflow-hidden flex items-center justify-center">
        {/* Placeholder for real app banner image */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-primary/5" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
            {"Chef's Kiss"}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm md:text-base text-pretty">
            Discover menus from our festival vendors
          </p>
        </div>
      </div>

      {/* ─── VENDOR LIST ─── */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4 px-1">
          All vendors
        </h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {vendors.map((vendor) => (
            <li key={vendor.id}>
              <Link
                href={`/vendor/${vendor.id}`}
                className="flex items-center justify-between px-4 py-4 md:py-5 gap-4 hover:bg-muted/60 transition-colors group"
              >
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {vendor.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {vendor.cuisine}
                  </p>
                </div>

                {/* Thumbnail placeholder */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-vendor-image-bg shrink-0 overflow-hidden">
                  {/* replace with <Image> once real logos are available */}
                </div>

                {/* Chevron */}
                <IconChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
