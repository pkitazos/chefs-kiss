import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { MENU_VENDORS } from "@/lib/config/menu";
import { AnimateIn } from "@/components/animate-in";
import { WavyPattern } from "@/components/brand-pattern";
import { SectionLabel } from "@/components/ui/section-label";
import { PageLayout } from "@/components/page-layout";
import { euro } from "@/lib/utils/format-currency";

interface Props {
  params: Promise<{ vendorId: string }>;
}

export default async function VendorPage({ params }: Props) {
  const { vendorId } = await params;
  return <VendorMenu vendorId={vendorId} />;
}

function VendorMenu({ vendorId }: { vendorId: string }) {
  const vendor = MENU_VENDORS.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <PageLayout className="max-w-2xl">
        <p className="text-muted-foreground text-lg">Vendor not found.</p>
        <Link
          href="/menu"
          className="text-primary mt-2 block text-sm underline"
        >
          Back to vendors
        </Link>
      </PageLayout>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#edede9]">
        <WavyPattern className="absolute inset-0 text-secondary/25" />

        {/* Vendor name */}
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-20 sm:px-6 md:pb-12 md:pt-24 lg:px-8">
          <AnimateIn>
            {/* Back button */}
            <Link
              href="/menu"
              className="mb-4 w-max flex items-center gap-1.5 bg-card/10 backdrop-blur-sm text-foreground text-sm font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-card transition-colors"
            >
              <IconArrowLeft size={15} />
              <span>All Vendors</span>
            </Link>

            <SectionLabel>{vendor.cuisine}</SectionLabel>
            <h1 className="mt-2 font-display text-3xl tracking-tight md:text-5xl">
              {vendor.name}
            </h1>
          </AnimateIn>
        </div>
      </div>

      <PageLayout className="max-w-2xl">
        <AnimateIn>
          {vendor.menu.map((section) => (
            <section key={section.section} className="mb-10 last:mb-0">
              {/* Section heading */}
              <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4 pb-2 border-b border-border">
                {section.section}
              </h2>

              {/* Items */}
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-lg font-medium text-foreground">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <p className="text-base md:text-lg font-semibold text-primary shrink-0 tabular-nums">
                      {euro(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </AnimateIn>
      </PageLayout>
    </>
  );
}
