import type { Metadata } from "next";

import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Contact | Chef's Kiss Festival",
  description: "Get in touch with the Chef's Kiss team.",
};

export default function ContactLayout({
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
