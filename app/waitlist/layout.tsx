import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
  robots: "noindex, nofollow",
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
