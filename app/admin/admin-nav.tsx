"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { IconArrowBadgeLeft } from "@tabler/icons-react";

const navItems = [{ href: "/admin", label: "back to Dashboard", exact: true }];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        if (isActive) return;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-sm transition-colors hover:text-foreground text-pink-400 font-semibold flex items-center",
            )}
          >
            <IconArrowBadgeLeft className="inline-block" size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
