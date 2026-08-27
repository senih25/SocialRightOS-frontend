import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { isBuildWeekGuidanceRuntimeEnabled } from "@/lib/build-week-guidance-runtime";
import { GssToolPageClient } from "./GssToolPageClient";
import { GssAuthorityGuide, gssAuthorityFaq } from "./GssAuthorityGuide";

export const metadata: Metadata = {
  title: "GSS gelir testi: başvuru ve ön değerlendirme",
  description:
    "GSS gelir testi kimler için, nereye başvurulur, gelir ve hane nasıl değerlendirilir, e-Devlet sonucu nasıl sorgulanır? Resmî kaynaklı rehber ve ön değerlendirme.",
  alternates: {
    canonical: "/gss-gelir-testi",
  },
  openGraph: {
    title: "GSS gelir testi: başvuru ve ön değerlendirme",
    description:
      "GSS gelir testi başvurusu, 2026 gelir eşiği, hane kapsamı, e-Devlet sonuç sorgulama ve resmî süreç hakkında kaynaklı rehber.",
    url: "/gss-gelir-testi",
    type: "website",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "GSS gelir testi", url: new URL("/gss-gelir-testi", siteUrl).toString() },
]);
const faqJsonLd = buildFaqJsonLd(gssAuthorityFaq);

export default function GssGelirTestiPage() {
  const buildWeekGuidanceEnabled = isBuildWeekGuidanceRuntimeEnabled(process.env);
  return (
    <>
      <GssToolPageClient buildWeekGuidanceEnabled={buildWeekGuidanceEnabled} />
      <GssAuthorityGuide />
      <JsonLd data={breadcrumbJsonLd} id="gss-breadcrumb-jsonld" />
      <JsonLd data={faqJsonLd} id="gss-faq-jsonld" />
    </>
  );
}
