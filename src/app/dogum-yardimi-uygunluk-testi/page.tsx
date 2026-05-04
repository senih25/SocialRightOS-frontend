import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { BirthGrantToolPageClient } from "./BirthGrantToolPageClient";

export const metadata: Metadata = {
  title: "Doğum yardımı uygunluk testi | D-SHR",
  description:
    "Doğum yardımı için adım adım ön değerlendirme, sonuç açıklaması ve başvuru öncesi rehber sunan araç.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi",
  },
  openGraph: {
    title: "Doğum yardımı uygunluk testi | D-SHR",
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
      <JsonLd data={breadcrumbJsonLd} id="birth-grant-breadcrumb-jsonld" />
    </>
  );
}
