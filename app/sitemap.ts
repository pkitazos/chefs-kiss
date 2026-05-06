import type { MetadataRoute } from "next";
import { env } from "@/lib/env/client";
import { VENDOR_DETAIL_VISIBLE } from "@/lib/config/features";
import { MENU_VENDORS } from "@/lib/config/menu";
import { WORKSHOPS } from "@/lib/config/workshops";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_APP_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, priority: 1 },
    { url: `${base}/workshops` },
    { url: `${base}/menu` },
    { url: `${base}/contact-us` },
    { url: `${base}/privacy` },
    { url: `${base}/toc` },
    { url: `${base}/cookies` },
    { url: `${base}/refund` },
  ];

  const workshopRoutes: MetadataRoute.Sitemap = WORKSHOPS.map((w) => ({
    url: `${base}/workshops/${w.slug}`,
  }));

  const vendorRoutes: MetadataRoute.Sitemap = VENDOR_DETAIL_VISIBLE
    ? MENU_VENDORS.map((v) => ({ url: `${base}/menu/${v.id}` }))
    : [];

  return [...staticRoutes, ...workshopRoutes, ...vendorRoutes];
}
