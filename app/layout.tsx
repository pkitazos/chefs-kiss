import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ppNeueMachina, manrope } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Chef's Kiss Food Festival",
  description: "Chef's Kiss Food Festival | May 16-17, 2026 | Ayia Napa Marina",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
