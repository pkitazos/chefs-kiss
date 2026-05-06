import type { Metadata } from "next";

import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse menus from all festival vendors at Chef's Kiss Festival.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  );
}
