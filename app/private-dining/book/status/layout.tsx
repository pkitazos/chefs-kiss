import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Status",
  robots: "noindex, nofollow",
};

export default function PrivateDiningStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
