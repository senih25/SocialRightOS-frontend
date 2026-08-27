import type { Metadata } from "next";
import { OfficialSourcesPanel } from "@/components/OfficialSourcesPanel";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { BirthGrantToolPageClient } from "./BirthGrantToolPageClient";

export const metadata: Metadata = {
  title: "Doğum yardımı ön değerlendirme",
  description:
    "Doğum yardımı için adım adım ön değerlendirme, sonuç açıklaması ve başvuru öncesi rehber sunan kurumsal araç.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi",
  },
  openGraph: {
    title: "Doğum yardımı ön değerlendirme",
    description:
      "Doğum yardımı için kısa soru akışı, sade sonuç ekranı ve başvuru öncesi rehber sunan ön değerlendirme aracı.",
    url: "/dogum-yardimi-uygunluk-testi",
    type: "website",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  {
    name: "Doğum yardımı uygunluk testi",
    url: new URL("/dogum-yardimi-uygunluk-testi", siteUrl).toString(),
  },
]);

export default function BirthGrantToolPage() {
  return (
    <>
      <BirthGrantToolPageClient />
      <div className="px-6 pb-12 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <OfficialSourcesPanel profileKey="birth-grant" />
        </div>
      </div>
      <JsonLd data={breadcrumbJsonLd} id="birth-grant-breadcrumb-jsonld" />
    </>
  );
}
