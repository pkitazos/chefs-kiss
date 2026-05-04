import { SiteNav } from "@/components/site-nav";

export default function PrivateDiningLayout({
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
