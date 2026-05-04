import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { GssToolPageClient } from "./GssToolPageClient";

export const metadata: Metadata = {
  title: "GSS gelir testi ön değerlendirme | D-SHR",
  description:
    "GSS gelir testi için anlaşılır, kolay kullanımlı ve kurumsal ön değerlendirme odaklı bir sayfa.",
  alternates: {
    canonical: "/gss-gelir-testi",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "GSS gelir testi ön değerlendirme", url: new URL("/gss-gelir-testi", siteUrl).toString() },
]);

export default function GssGelirTestiPage() {
  return (
    <>
      <GssToolPageClient />
      <JsonLd data={breadcrumbJsonLd} id="gss-breadcrumb-jsonld" />
    </>
  );
}
