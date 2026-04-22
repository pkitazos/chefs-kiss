import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { ppNeueMachina, manrope } from "@/lib/fonts";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";

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
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
