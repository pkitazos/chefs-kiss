import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { SiteFooterSlot } from "@/components/site-footer-slot";
import { CURRENT_EVENT, EVENT_DESCRIPTION } from "@/lib/config/event";
import { env } from "@/lib/env/client";
import { manrope, ppNeueMachina } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    template: "%s | Chef's Kiss Festival",
    default: CURRENT_EVENT.name,
  },
  description: EVENT_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Chef's Kiss Festival",
    locale: "en_CY",
    title: CURRENT_EVENT.name,
    description: EVENT_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
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
