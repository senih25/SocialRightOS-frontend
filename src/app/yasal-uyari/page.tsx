import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { LegalReviewNotice } from "@/components/ui/LegalReviewNotice";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { siteOperations } from "@/lib/site-operations";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Yasal Uyarı",
  description:
    "Dijital Sosyal Hak Rehberi'nin resmî karar vermediğini, rehber niteliğini ve kullanım sınırlarını açıklayan sayfa.",
  alternates: {
    canonical: "/yasal-uyari",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "Yasal uyarı", url: new URL("/yasal-uyari", siteUrl).toString() },
]);

export default function LegalNoticePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Yasal Uyarı</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Bu site resmî karar üretmez, yalnızca rehberlik sunar
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Site üzerinde verilen bilgi, ön değerlendirme ve yönlendirme niteliğindedir. Nihai
            karar ilgili kamu kurumlarının güncel mevzuat ve belge incelemesi ile verilir.
          </p>
        </section>

        <LegalReviewNotice />

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Kullanım sınırı</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteProfile.trustPoints.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Yayın ilkesi</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteOperations.publishingRules.map((rule) => (
                <li key={rule} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {rule}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Ne zaman doğrulama gerekir?</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <p>
              Başvuru yapmadan önce ilgili kurumun güncel duyurularını, il veya ilçe başvuru
              kanalını ve istenen belge listesini doğrulamanız gerekir.
            </p>
            <p>
              Buradaki sayfalar planlama, hazırlık ve ön okuma amaçlıdır. Resmî başvuru ve sonuç
              teyidi için kurum kanallarını kullanın.
            </p>
            <p>
              Sağlık raporu, kimlik belgesi, teşhis, açık adres veya başka özel nitelikli kişisel
              veri girmeyin.
            </p>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">İletişim ve destek</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Bir hata, eksik bilgi veya güncelleme önerisi için iletişim sayfasını kullanabilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/iletisim" className="secondary-link inline-flex">
              İletişim sayfası
            </Link>
            <Link href="/methodology" className="secondary-link inline-flex">
              Yöntem sayfası
            </Link>
          </div>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="legal-breadcrumb-jsonld" />
      </div>
    </main>
  );
}
