import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { vendors } from "../sample-vendors";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VendorPage({ params }: Props) {
  const { id } = await params;
  return <VendorMenu vendorId={id} />;
}

function VendorMenu({ vendorId }: { vendorId: string }) {
  const vendor = vendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background font-sans">
        <p className="text-muted-foreground text-lg">Vendor not found.</p>
        <Link
          href="/"
          className="text-primary underline underline-offset-4 text-sm"
        >
          Back to vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── HERO BANNER ─── */}
      <div className="relative w-full h-52 md:h-72 bg-vendor-image-bg overflow-hidden">
        {/* Placeholder for real vendor hero image */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-primary/5" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-card transition-colors"
        >
          <IconArrowLeft size={15} />
          <span>Vendors</span>
        </Link>

        {/* Vendor name overlay */}
        <div className="absolute inset-0 flex items-end z-10 px-6 pb-6 md:px-10 md:pb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
              {vendor.cuisine}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
              {vendor.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── MENU ─── */}
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
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
                    ${item.price}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
