import type { Metadata } from "next";
import Link from "next/link";
import { brandProfile } from "@/lib/brand-profile";

export const metadata: Metadata = {
  title: "SocialRightLabs",
  description: brandProfile.organization.description,
  alternates: {
    canonical: brandProfile.organization.profilePath,
  },
};

const focusAreas = [
  "Sosyal hak bilgisine erişimi kolaylaştıran dijital ürünler",
  "Güvenli ve açıklanabilir yapay zekâ destekli bilgi sistemleri",
  "Dijital kamu hizmetleri için kullanıcı odaklı rehber araçları",
  "Kişisel veri minimizasyonu ve yerel-öncelikli ürün tasarımı",
];

export default function SocialRightLabsPage() {
  return (
    <main className="page-shell">
      <section className="content-panel">
        <p className="section-label">Çatı marka</p>
        <h1 className="section-heading mt-3">{brandProfile.organization.name}</h1>

        <p className="section-copy mt-5 max-w-3xl">
          {brandProfile.organization.description}
        </p>

        <p className="section-copy mt-4 max-w-3xl">
          SocialRightLabs; sosyal haklar, dijital kamu hizmetleri ve güvenli
          yapay zekâ sistemleri kesişiminde ölçülü, açıklanabilir ve kullanıcı
          onayına dayalı ürünler geliştirmeyi amaçlar.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {focusAreas.map((item) => (
            <article key={item} className="content-card">
              <h2 className="text-base font-semibold text-slate-900">{item}</h2>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="primary-link">
            Sosyal Hak Rehberi
          </Link>
          <Link href={brandProfile.founder.profilePath} className="secondary-link">
            Kurucu profili
          </Link>
        </div>
      </section>
    </main>
  );
}
