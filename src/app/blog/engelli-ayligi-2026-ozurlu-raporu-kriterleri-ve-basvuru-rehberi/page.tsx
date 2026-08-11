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
    "Engelli Aylığı 2026: Resmî Şartlar, Rapor ve Başvuru Rehberi",
  description:
    "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî kaynaklarına göre 2026 engelli aylığı tutarları, %40 ve üzeri rapor şartı ve SYDV başvuru süreci.",
  keywords: [
    "engelli aylığı 2026",
    "engelli maaşı 2026 ne kadar",
    "özürlü raporu kriterleri 2026",
    "engelli aylığı başvuru şartları",
    "ağır engelli maaşı hak kriterleri 2026",
    "sağlık kurulu raporu engelli oranı",
    "engelli aylığı e-devlet başvuru",
    "2026 engelli maaşı gelir sınırı",
  ],
  alternates: {
    canonical:
      "/blog/engelli-ayligi-2026-ozurlu-raporu-kriterleri-ve-basvuru-rehberi",
  },
  openGraph: {
    title:
      "Engelli Aylığı 2026: Resmî Şartlar, Rapor ve Başvuru Rehberi",
    description:
      "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî kaynaklarına göre 2026 engelli aylığı tutarları, %40 ve üzeri rapor şartı ve SYDV başvuru süreci.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Engelli Aylığı 2026: Resmî Şartlar, Rapor ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Engelli aylığı, 2022 sayılı Kanun kapsamında sosyal güvencesi olmayan ve gelir kriterini sağlayan 18 yaş üstü engelli bireylere ödenen nakdi bir sosyal yardımdır.
2026 yılı tutarları %40-%69 engelliler için 5.793,31 TL, %70 ve üzeri engelliler için 8.689,97 TL olarak program tablosunda yer almaktadır.
Başvuru için engelli sağlık kurulu raporu gerekir; rapor yetkili sağlık kuruluşlarınca düzenlenir.
Hak ve başvuru bilgileri için SYDV, Bakanlığın program tablosu ve resmî SSS sayfaları takip edilmelidir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Engelli Aylığı 2026: Özürlü Raporu Kriterleri ve Başvuru Rehberi",
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
    "engelli aylığı 2026, engelli sağlık kurulu raporu, engelli maaşı başvurusu, 2022 sayılı kanun, sydv",
};

const HASHTAGS = [
  "#EngelliMaaşıNeKadar",
  "#EvdeBakımMaaşı2026",
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
      name: "Engelli Aylığı 2026",
      url: new URL(
        "/blog/engelli-ayligi-2026-ozurlu-raporu-kriterleri-ve-basvuru-rehberi",
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
              Engelli Aylığı 2026
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
                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Sağlık Raporu Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Engelli Aylığı 2026: Resmî Şartlar, Rapor ve Başvuru Rehberi
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
                  Engelli aylığı, 2022 sayılı Kanun&apos;un 17. maddesi
                  kapsamında düzenlenen, sosyal güvencesi olmayan ve gelir
                  kriterini sağlayan 18 yaş üstü engelli bireyler için
                  ödenen nakdi bir sosyal yardımdır.
                  Başvuru değerlendirmesinde engelli sağlık kurulu raporu,
                  yüzde 40 ve üzeri engel oranı ve hane içi gelir kriteri esas
                  alınır.
                </p>
              </section>

              {/* 2026 Güncel Bilgi */}
              <section className="bg-purple-50/60 p-6 md:p-8 rounded-2xl border border-purple-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Yılı Engelli Aylığı Hak Yapısı
                </h2>
                <p className="text-slate-700 mb-4">
                  Aile ve Sosyal Hizmetler Bakanlığı’nın resmî program
                  tablosuna göre engelli aylığı, engel oranına ve gelir
                  kriterine göre iki ana tutar üzerinden uygulanmaktadır:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      %40-%69
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      5.793,31 TL
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Aylık ödeme
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      %70 ve üzeri
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      8.689,97 TL
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Aylık ödeme
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      Başvuru kanalı
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      SYDV / Bakanlık SSS
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Resmî başvuru
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 mt-4">
                  <h3 className="font-black text-amber-800 mb-2 text-sm text-center">ℹ️ Güncel Bilgi</h3>
                  <p className="text-sm text-amber-700 text-center">
                    Sosyal yardım hakları resmî program tablosunda yayımlanır.
                    Güncel durum için <strong>SYDV</strong> ve Bakanlığın resmî SSS sayfaları takip edilmelidir.
                  </p>
                </div>
              </section>

              {/* Sağlık Kurulu Raporu Kriterleri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Sağlık Kurulu Raporu Kriterleri ve Engellilik Dereceleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli aylığı başvurusu için düzenlenen engelli sağlık
                  kurulu raporu, yetkili sağlık kuruluşlarınca hazırlanır ve
                  başvuru değerlendirmesinde temel belgedir:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Engel oranı:</strong> Yüzde 40 ve üzeri oran
                      engelli aylığı için temel eşiktir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Yetkili kurum:</strong> Rapor, Bakanlıkça
                      yetkilendirilmiş sağlık kuruluşlarınca düzenlenmelidir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Diğer kullanım alanları:</strong> Aynı rapor
                      engelli aylığı dışında bakım hizmetleri, eğitim ve
                      istihdam süreçlerinde de kullanılabilir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>İtiraz ve yenileme:</strong> Raporlara 30 gün
                      içinde İl Sağlık Müdürlüğü üzerinden itiraz edilebilir;
                      değişiklik halinde rapor yenileme süreci başlatılabilir.
                    </span>
                  </li>
                </ul>
              </section>

              {/* Başvuru Şartları ve Süreci */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Başvuru Şartları ve Süreç
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli aylığı başvuruları ikametgah adresindeki Sosyal
                  Yardımlaşma ve Dayanışma Vakfı (SYDV)&apos;na yapılır.
                  Başvuru öncesi aşağıdaki şartların sağlanması gerekir:
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      1. Yaş ve Vatandaşlık Şartı
                    </h3>
                    <p className="text-sm text-slate-700">
                      18 yaşından büyük engelli bireyler ile 18 yaşından
                      küçük engelli yakını bulunanlar için ayrı başvuru imkânı
                      vardır.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      2. Gelir Testi Şartı
                    </h3>
                    <p className="text-sm text-slate-700">
                      Hane içinde kişi başına düşen aylık gelir net asgari
                      ücretin 1/3&apos;ünü geçmemelidir.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      3. Sosyal Güvence Şartı
                    </h3>
                    <p className="text-sm text-slate-700">
                      Sosyal güvenlik kurumlarından gelir veya aylık
                      alınmaması gerekir.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Sık Yapılan Hatalar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Rapor kullanımı:
                    </strong>{" "}
                    Engelli sağlık kurulu raporu başvuru için temel belgedir;
                    raporun yetkili kuruluşlardan alınmış olması gerekir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İtiraz hakkı:
                    </strong>{" "}
                    Sağlık kurulu raporlarına ilişkin itirazlar mevzuattaki
                    süre ve usule göre İl Sağlık Müdürlüğü&apos;ne yapılır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Rapor güncelleme:
                    </strong>{" "}
                    Yeni bir engel durumunun ortaya çıkması veya mevcut
                    durumun değişmesi halinde rapor yenileme süreci
                    başlatılabilir.
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
                      2022 Sayılı Kanun Kapsamındaki Engelli ve Yaşlı Aylıkları
                    </em>
                    . Resmî SSS sayfası.
                  </li>
                  <li>
                    [2] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Sosyal Yardım Programlarımız
                    </em>
                    . SYGM program tablosu.
                  </li>
                  <li>
                    [3] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Engelliler İçin Sağlık Kurulu Raporları
                    </em>
                    . Resmî SSS sayfası.
                  </li>
                  <li>
                    [4] T.C. Sağlık Bakanlığı. (2019).{" "}
                    <em>
                      Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik
                    </em>
                    . Resmî Gazete, Sayı: 30692.
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
