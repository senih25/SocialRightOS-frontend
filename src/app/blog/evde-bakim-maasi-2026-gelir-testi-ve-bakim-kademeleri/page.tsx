import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title:
    "Evde Bakım Yardımı 2026: Tam Bağımlı Rapor, Gelir Kriteri ve Başvuru Rehberi",
  description:
    "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî kaynaklarına göre 2026 evde bakım yardımı, gelir kriteri, tam bağımlı/ağır engelli rapor şartı ve başvuru süreci.",
  keywords: [
    "evde bakım maaşı 2026",
    "evde bakım gelir sınırı 2026",
    "ağır engelli bakım ücreti",
    "hafif engelli bakım parası",
    "evde bakım maaşı başvuru şartları",
    "SYDV evde bakım başvurusu",
    "evde bakım maaşı ne kadar",
  ],
  alternates: {
    canonical: "/blog/evde-bakim-maasi-2026-gelir-testi-ve-bakim-kademeleri",
  },
  openGraph: {
    title:
      "Evde Bakım Yardımı 2026: Tam Bağımlı Rapor, Gelir Kriteri ve Başvuru Rehberi",
    description:
      "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî kaynaklarına göre 2026 evde bakım yardımı, gelir kriteri, tam bağımlı/ağır engelli rapor şartı ve başvuru süreci.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Evde Bakım Yardımı 2026: Tam Bağımlı Rapor, Gelir Kriteri ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Evde bakım yardımı, bakıma ihtiyacı olan engelli bireylerin ailelerinin yanında desteklenmesi için verilen nakdi bir yardımdır.
2026 yılında yardımın temel koşulları; hane içi kişi başına düşen gelirinin net asgari ücretin 2/3'ünden az olması, yetkili sağlık kuruluşu raporu ve bakım ihtiyacının resmî değerlendirme ile doğrulanmasıdır.
18 yaş üstü bireylerde raporda ağır engelli veya tam bağımlı ibaresi, 18 yaş altı bireylerde ise ilgili ÇÖZGER ibareleri aranır.
Başvurular il müdürlüğü veya sosyal hizmet merkezi üzerinden yapılır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Evde Bakım Yardımı 2026: Tam Bağımlı Rapor, Gelir Kriteri ve Başvuru Rehberi",
  author: {
    "@type": "Person",
    name: "Senih Bayankulu",
    jobTitle: "Bireysel Sosyal Hizmet Danışmanı",
    url: "https://www.linkedin.com/in/senih25/",
  },
  publisher: {
    "@type": "Organization",
    name: "D-SHR",
    logo: {
      "@type": "ImageObject",
      url: "https://sosyalhakrehberi.com/d-shr-logo.svg",
    },
  },
  datePublished: "2026-05-04",
  dateModified: "2026-05-04",
  articleSection: "Sosyal Hak Analizi",
  inLanguage: "tr-TR",
  keywords:
    "evde bakım yardımı 2026, evde bakım gelir sınırı, tam bağımlı rapor, SYDV başvurusu, e-devlet",
};

const HASHTAGS = [
  "#EvdeBakımMaaşı2026",
  "#EngelliMaaşıNeKadar",
  "#SosyalYardımTutarları",
  "#SYDV",
  "#2026Güncel",
  "#SosyalHaklar",
  "#MevzuatAnalizi",
];

export default function Page() {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog ve Analiz", url: new URL("/blog", siteUrl).toString() },
    {
      name: "Evde Bakım Yardımı 2026",
      url: new URL(
        "/blog/evde-bakim-maasi-2026-gelir-testi-ve-bakim-kademeleri",
        siteUrl,
      ).toString(),
    },
  ]);

  return (
    <main className="min-h-screen bg-[#FFFBEB] py-12 lg:py-16">
      <div className="mx-auto px-6 max-w-4xl lg:px-10">
        {/* Breadcrumb + Actions */}
        <nav className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-cyan-600 transition-colors">
              Ana Sayfa
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-cyan-600 transition-colors"
            >
              Blog ve Analiz
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-bold">
              Evde Bakım Yardımı 2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <VoiceGuide text={VOICE_TEXT} label="Makaleyi Dinle" />
          </div>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Bilgilendirme Rehberi
                </span>
                <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Mevzuat Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Evde Bakım Yardımı 2026: Tam Bağımlı Rapor, Gelir Kriteri ve Başvuru Rehberi
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="font-bold text-slate-700">
                  Yazar:{" "}
                  <span className="text-orange-600">
                    Senih Bayankulu
                  </span>
                </span>
                <span>|</span>
                <span>4 Mayıs 2026 | Güncelleme: 1 Temmuz 2026</span>
                <span>|</span>
                <span>~2 dk okuma</span>
              </div>
            </header>

            {/* Content */}
            <div className="space-y-8 text-slate-800 leading-loose">
              {/* Giriş */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Giriş ve Hukuki Çerçeve
                </h2>
                <p className="text-slate-700">
                  Evde bakım yardımı, bakıma ihtiyacı olan engelli bireylerin
                  ailelerinin yanında desteklenmesi için verilen nakdi bir
                  sosyal yardımdır. Yardımın hukuki dayanağı 2828 sayılı
                  Sosyal Hizmetler Kanunu&apos;nun ek 7 nci maddesi ve buna
                  dayanılarak çıkarılan Evde Bakım Yardımı Yönetmeliği&apos;dir.
                  2026 uygulamasında temel belirleyici faktörler; gelir
                  kriteri, sağlık kurulu raporu ve bakım ihtiyacının resmî
                  değerlendirmesidir.
                </p>
              </section>

              {/* Gelir Testi */}
              <section className="bg-cyan-50/60 p-6 md:p-8 rounded-2xl border border-cyan-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Gelir ve Yardım Kriterleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Resmî mevzuata göre, evde bakım yardımı alabilmek için hane
                  içindeki kişi başına düşen aylık gelirin{" "}
                  <strong>net asgari ücretin 2/3&apos;ünden az</strong> olması
                  gerekmektedir. Başvuruda ayrıca engelli sağlık kurulu
                  raporundaki bakım ihtiyacı değerlendirilir.
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Hane tanımı:</strong> Aynı konutta ikamet eden
                      bireylerin gelirleri birlikte değerlendirilir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Gelir kapsamı:</strong> Ücret, maaş, kira, tarım,
                      hayvancılık ve benzeri gelirler dikkate alınır
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Değerlendirme:</strong> Gelir kriteri ile
                      sağlık kurulu değerlendirmesi birlikte yürütülür
                    </span>
                  </li>
                </ul>
              </section>

              {/* Bakım Kademeleri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Bakım Muhtaçlığı ve Rapor Şartı
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli sağlık kurulu raporunda yer alan ibareler, yardımın
                  kapsamını doğrudan etkiler. Resmî metinlerde yetişkin ve çocuk
                  için ayrı değerlendirme yapılır:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h3 className="font-black text-red-800 mb-2">
                      18 Yaş Üstü
                    </h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Raporda “ağır engelli” veya “tam bağımlı” ibaresi
                      bulunmalıdır.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                    <h3 className="font-black text-amber-800 mb-2">
                      18 Yaş Altı
                    </h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      ÇÖZGER raporunda “ağır engelli”, “Çok ileri düzeyde özel
                      gereksinimi vardır”, “Belirgin özel gereksinimi vardır”
                      veya “Özel koşul gereksinimi var” ifadelerinden biri
                      aranır.
                    </p>
                  </div>
                </div>
              </section>

              {/* Başvuru Süreci */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Başvuru Süreci ve Gerekli Evraklar
                </h2>
                <p className="text-slate-700 mb-4">
                  Başvurular ikametgâh adresindeki Aile ve Sosyal Hizmetler İl
                  Müdürlüğü veya Sosyal Hizmet Merkezi Müdürlüğüne yapılır.
                  Yönetmeliğe göre başvurular il müdürlüğü veya sosyal
                  hizmet merkezi üzerinden yapılır.
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>Engelli Sağlık Kurulu Raporu</strong> (bakım
                    ihtiyacını gösteren rapor)
                  </li>
                  <li>
                    <strong>Kimlik bilgileri</strong> (başvuru sahibine ait)
                  </li>
                  <li>
                    <strong>Gelir ve varlık beyanı</strong> (hane içi kişi başı
                    gelir değerlendirmesi için)
                  </li>
                  <li>
                    <strong>İkametgâh ve yerleşim bilgisi</strong> (yerleşim
                    yeri doğrulaması için)
                  </li>
                  <li>
                    <strong>Başvuru formu</strong> (il müdürlüğü veya sosyal
                    hizmet merkezince yönlendirilir)
                  </li>
                </ol>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Sık Yapılan Hatalar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Rapor kontrolü:
                    </strong>{" "}
                    Yönetmelik uyarınca evde bakım yardımı koşulları düzenli
                    olarak kontrol edilir; koşul kaybı halinde yardım yeniden
                    değerlendirilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İtiraz hakkı:
                    </strong>{" "}
                    Sağlık kurulu raporlarına ilişkin itirazlar ilgili
                    mevzuattaki süre ve usule göre İl Sağlık Müdürlüğüne
                    yapılır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Başvuru kanalı:
                    </strong>{" "}
                    İl müdürlüğü ve sosyal hizmet merkezi kanalları kullanılır.
                  </p>
                </div>
              </section>

              {/* Hashtags */}
              <section className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {HASHTAGS.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* Kaynakça */}
              <footer className="mt-12 pt-8 border-t-2 border-slate-100">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4">
                  Resmî Kaynak Notları
                </h3>
                <ul className="text-sm text-slate-500 space-y-2 leading-relaxed">
                  <li>
                    [1] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Evde Bakım Yardımı ve Gündüz Hizmetleri
                    </em>
                    . Resmî SSS sayfası.
                  </li>
                  <li>
                    [2] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Evde Bakım Yardımı Yönetmeliği
                    </em>
                    . Mevzuat sayfası.
                  </li>
                  <li>
                    [3] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Engelliler İçin Sağlık Kurulu Raporları
                    </em>
                    . Resmî SSS sayfası.
                  </li>
                  <li>
                    [4] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Sosyal yardım programlarının aylık ödemeleri artırıldı
                    </em>
                    . Haber duyurusu.
                  </li>
                </ul>
              </footer>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Bu içerik ön değerlendirme ve rehberlik amaçlıdır. Resmî karar
                değildir.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/evde-bakim-maasi"
                  className="bg-teal-500 text-white font-black px-5 py-2.5 rounded-full hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/30 transition-all text-sm"
                >
                  Uygunluk Testine Git
                </Link>
                <Link
                  href="/blog"
                  className="bg-white text-slate-700 font-bold px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                >
                  Tüm Analizler
                </Link>
              </div>
            </div>
          </div>
        </article>

        <JsonLd data={ARTICLE_JSON_LD} id="article-jsonld" />
        <JsonLd data={breadcrumbJsonLd} id="breadcrumb-jsonld" />
      </div>
    </main>
  );
}
