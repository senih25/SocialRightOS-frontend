import type { Metadata } from "next";
import { OfficialSourcesPanel } from "@/components/OfficialSourcesPanel";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { OldAgeToolPageClient } from "./OldAgeToolPageClient";

export const metadata: Metadata = {
  title: "65 yaş aylığı ön değerlendirme",
  description:
    "65 yaş aylığı için daha büyük yazı, sade form ve kurumsal ön değerlendirme sunan sayfa.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  {
    name: "65 yaş aylığı ön değerlendirme",
    url: new URL("/65-yas-ayligi-uygunluk-testi", siteUrl).toString(),
  },
]);

export default function OldAgeToolPage() {
  return (
    <>
      <OldAgeToolPageClient />
      <div className="px-6 pb-12 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <OfficialSourcesPanel profileKey="old-age" />
        </div>
      </div>
      <JsonLd data={breadcrumbJsonLd} id="old-age-breadcrumb-jsonld" />
    </>
  );
}
