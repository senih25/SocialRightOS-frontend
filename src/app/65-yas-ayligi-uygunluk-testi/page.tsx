import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { OldAgeToolPageClient } from "./OldAgeToolPageClient";

export const metadata: Metadata = {
  title: "65 yaş aylığı uygunluk testi | D-SHR",
  description:
    "65 yaş aylığı için daha büyük yazı, sade form ve anlaşılır ön değerlendirme sunan sayfa.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  {
    name: "65 yaş aylığı uygunluk testi",
    url: new URL("/65-yas-ayligi-uygunluk-testi", siteUrl).toString(),
  },
]);

export default function OldAgeToolPage() {
  return (
    <>
      <OldAgeToolPageClient />
      <JsonLd data={breadcrumbJsonLd} id="old-age-breadcrumb-jsonld" />
    </>
  );
}
