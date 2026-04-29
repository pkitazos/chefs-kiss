import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { SiteFooterSlot } from "@/components/site-footer-slot";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";
import { manrope, ppNeueMachina } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: CURRENT_EVENT.name,
  description: `${CURRENT_EVENT.name} | ${eventDateFormat.range()} | ${CURRENT_EVENT.locationName}`,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ppNeueMachina.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <Providers>
          {children}
          <SiteFooterSlot />
        </Providers>
      </body>
    </html>
  );
}
