import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { contentRegistry } from "@/lib/content-registry";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog ve rehber yaz─▒lar─▒",
  description:
    "Sosyal hak testlerinden y├Ânlendirebilece─şiniz rehber yaz─▒lar─▒, temel a├ğ─▒klamalar ve ba┼şvuru ├Âncesi bilgi sayfalar─▒.",
  alternates: {
    canonical: "/blog",
  },
};

const sectionLabelMap: Record<string, string> = {
  homepage: "Ana Sayfa",
  about: "Hakk─▒m─▒zda",
  methodology: "Y├Ântem",
  blog: "Blog",
  tool: "Test",
  guide: "Rehber",
};

const contentTopics = [
  "┼Şartlar ve temel uygunluk ba┼şl─▒klar─▒",
  "Gelir ve hane bilgisini do─şru haz─▒rlama",
  "Ba┼şvuru ├Âncesi haz─▒rl─▒k ad─▒mlar─▒",
  "Gerekli belgeleri anlamaya yard─▒mc─▒ rehberler",
  "Ret veya eksik bilgi nedenlerini sade dille a├ğ─▒klayan yaz─▒ dizileri",
  "S─▒k sorulan sorular ve k─▒sa cevaplar",
];

const publishedEntries = [...contentRegistry]
  .filter((entry) => entry.status === "published")
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
              Testlerden sonra yolunuzu bulman─▒za yard─▒m eden rehber sayfalar─▒
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              Bu sayfa sosyal hak testlerinden y├Ânlenece─şiniz rehber yaz─▒lar─▒n─▒ bir araya getirir.
              Amac─▒m─▒z teknik dili azaltmak, sonraki ad─▒m─▒ g├Âstermek ve kullan─▒c─▒n─▒n sitede do─şal
              bi├ğimde ilerlemesini sa─şlamakt─▒r.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Testlere d├Ân
              </Link>
              <Link href="/hakkimizda" className="secondary-link">
                Hakk─▒m─▒zda
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Bu sayfada ne var?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Blog y├╝zeyi kurum duyurusu veya resm├« mevzuat servisi de─şildir. Testlerden sonra
              kullan─▒c─▒n─▒n anlayaca─ş─▒ dilde a├ğ─▒klama, rehberlik ve bir sonraki ad─▒m y├Ânlendirmesi
              sunar.
            </p>
          </aside>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">├ûne ├ğ─▒kan rehberler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {publishedEntries.slice(0, 3).map((entry) => (
              <article key={entry.canonical_path} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {sectionLabelMap[entry.section] ?? "─░├ğerik"}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{entry.body}</p>
                <Link href={entry.canonical_path} className="secondary-link mt-4 inline-flex">
                  Yaz─▒y─▒ a├ğ
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">T├╝m yay─▒nlanan i├ğerikler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {publishedEntries.map((entry) => (
              <article key={entry.canonical_path} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {sectionLabelMap[entry.section] ?? "─░├ğerik"}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{entry.body}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link href={entry.canonical_path} className="secondary-link inline-flex">
                    Sayfay─▒ a├ğ
                  </Link>
                  <span className="text-xs text-slate-500">{entry.canonical_path}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">
            Blog yap─▒s─▒nda i┼şleyece─şimiz ana ba┼şl─▒klar
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
