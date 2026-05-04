import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { contentRegistry } from "@/lib/content-registry";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog ve rehber yazıları | D-SHR",
  description:
    "Sosyal hak testlerinden yönlendirebileceğiniz rehber yazıları, temel açıklamalar ve başvuru öncesi bilgi sayfaları.",
  alternates: {
    canonical: "/blog",
  },
};

const sectionLabelMap: Record<string, string> = {
  homepage: "Ana Sayfa",
  about: "Hakkımızda",
  methodology: "Yöntem",
  blog: "Blog",
  tool: "Test",
  guide: "Rehber",
};

const contentTopics = [
  "Şartlar ve temel uygunluk başlıkları",
  "Gelir ve hane bilgisini doğru hazırlama",
  "Başvuru öncesi hazırlık adımları",
  "Gerekli belgeleri anlamaya yardımcı rehberler",
  "Ret veya eksik bilgi nedenlerini sade dille açıklayan yazı dizileri",
  "Sık sorulan sorular ve kısa cevaplar",
];

const publishedEntries = [...contentRegistry]
  .filter((entry) => entry.status === "published" && entry.section === "blog" && entry.slug !== "blog")
  .sort((left, right) => right.updated_at.localeCompare(left.updated_at));

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "Blog", url: new URL("/blog", siteUrl).toString() },
]);

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Blog ve Rehberler</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Testlerden sonra yolunuzu bulmanıza yardım eden rehber sayfaları
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              Bu sayfa sosyal hak testlerinden yönleneceğiniz rehber yazılarını bir araya getirir.
              Amacımız teknik dili azaltmak, sonraki adımı göstermek ve kullanıcının sitede doğal
              biçimde ilerlemesini sağlamaktır.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Testlere dön
              </Link>
              <Link href="/hakkimizda" className="secondary-link">
                Hakkımızda
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Bu sayfada ne var?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Blog yüzeyi kurum duyurusu veya resmî mevzuat servisi değildir. Testlerden sonra
              kullanıcının anlayacağı dilde açıklama, rehberlik ve bir sonraki adım yönlendirmesi
              sunar.
            </p>
          </aside>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Öne çıkan rehberler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {publishedEntries.slice(0, 3).map((entry) => (
              <article key={entry.canonical_path} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {sectionLabelMap[entry.section] ?? "İçerik"}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{entry.body}</p>
                <Link href={entry.canonical_path} className="secondary-link mt-4 inline-flex">
                  Yazıyı aç
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Tüm yayınlanan içerikler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {publishedEntries.map((entry) => (
              <article key={entry.canonical_path} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {sectionLabelMap[entry.section] ?? "İçerik"}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{entry.body}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link href={entry.canonical_path} className="secondary-link inline-flex">
                    Sayfayı aç
                  </Link>
                  <span className="text-xs text-slate-500">{entry.canonical_path}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">
            Blog yapısında işleyeceğimiz ana başlıklar
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {contentTopics.map((topic) => (
              <article
                key={topic}
                className="rounded-2xl bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700"
              >
                {topic}
              </article>
            ))}
          </div>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="blog-breadcrumb-jsonld" />
      </div>
    </main>
  );
}

