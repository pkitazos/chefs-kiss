import { SiteNav } from "@/components/site-nav";

export default function LegalLayout({
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
