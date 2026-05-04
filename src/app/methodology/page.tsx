import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { homeCareMethodologyContent } from "@/lib/methodology-content";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Yöntem ve Sınırlar | Çalışma İlkeleri",
  description:
    "Sosyal Hak Rehberi'nin içerik ilkelerini, sonuç mantığını, kurucu yaklaşımını ve ön değerlendirme sınırlarını açıklar.",
  alternates: {
    canonical: "/methodology",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "Yöntem ve Sınırlar", url: new URL("/methodology", siteUrl).toString() },
]);

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <article className="card-panel">
            <p className="eyebrow">{homeCareMethodologyContent.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.25rem]">
              {homeCareMethodologyContent.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
              {homeCareMethodologyContent.subtitle}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Misyon
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{siteProfile.mission}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Vizyon
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{siteProfile.vision}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Sınır
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Resmî karar yok; ön değerlendirme ve yönlendirme var.
                </p>
              </div>
            </div>
          </article>

          <aside className="card-panel">
            <p className="eyebrow">Kurucu notu</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              Senih Bayankulu
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {siteProfile.founderRole}
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700">
              {siteProfile.founderSummary}
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Kurucu yaklaşımı</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {siteProfile.professionalSummary}
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-5">
          {homeCareMethodologyContent.sections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Sonraki adım</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Ön değerlendirme sonucunu gördüyseniz bilgilerinizi resmî başvuru kanallarında
            doğrulayın ve gerekirse rehber sayfasındaki hazırlık adımlarını gözden geçirin.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {homeCareMethodologyContent.links.map((link) => (
              <Link key={link.href} href={link.href} className="secondary-link inline-flex">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-950">
          <p className="font-semibold">Önemli not</p>
          <p className="mt-2">{homeCareMethodologyContent.disclaimer}</p>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="methodology-breadcrumb-jsonld" />
      </div>
    </main>
  );
}
