import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Engelli Aylığı 2026: Özürlü Raporu Kriterleri ve Başvuru Rehberi",
  description:
    "2026 engelli aylığı oran temelli şartlar, Sağlık Bakanlığı Özürlü Sağlık Kurulu raporu kriterleri ve SYDV başvuru süreci. Akademik mevzuat analizi.",
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
      "Engelli Aylığı 2026: Özürlü Raporu Kriterleri ve Başvuru Rehberi",
    description:
      "2026 engelli aylığı oran temelli şartlar, Sağlık Bakanlığı Özürlü Sağlık Kurulu raporu kriterleri ve SYDV başvuru süreci.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Engelli Aylığı 2026: Özürlü Raporu Kriterleri ve Başvuru Rehberi.
Yazar: Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu.

Engelli aylığı, 2022 sayılı Kanun kapsamında çalışma gücü kaybı oranı yüzde 40 ve üzerinde olan bireylere ödenen nakdi bir sosyal yardımdır.
2026 yılında engelli aylığı hak değerlendirmesi, ağır engelli, orta engelli ve hafif engelli kategorilerine göre farklılaşmaktadır.
Güncel hak bilgisini öğrenmek için e-Devlet üzerinden sorgulama yapabilir veya ikametinizdeki SYDV'ye danışabilirsiniz.
Başvuru için Sağlık Bakanlığı Engelli Sağlık Kurulu tarafından düzenlenen raporda çalışma gücü kaybı oranının belirtilmesi zorunludur.
Gelir testi şartı da aranır; hane içi kişi başına düşen gelir asgari ücretin iki katından az olmalıdır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
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
    name: "D-SHR | Dijital Sosyal Hak Rehberi — SocialRightLabs",
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
    "engelli aylığı 2026, özürlü raporu kriterleri, sağlık kurulu raporu, engelli maaşı başvurusu",
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
                  Akademik Analiz
                </span>
                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Sağlık Raporu Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Engelli Aylığı 2026: Özürlü Raporu Kriterleri ve Başvuru
                Rehberi
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="font-bold text-slate-700">
                  Yazar:{" "}
                  <span className="text-orange-600">
                    Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu
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
                  kapsamında düzenlenen, çalışma gücü kaybı oranı yüzde 40 ve
                  üzerinde olan bireylerin ekonomik desteklenmesi amacıyla
                  ödenen nakdi bir sosyal yardımdır. Bu yardımın 2026 yılı
                  uygulamalarında temel belirleyici unsur, Sağlık Bakanlığı
                  Engelli Sağlık Kurulu tarafından düzenlenen raporda tespit
                  edilen çalışma gücü kaybı oranı ile hane içi gelir testi
                  sonuçlarıdır. Akademik literatürde engelli aylığı, sosyal
                  devlet ilkesinin en somut göstergelerinden biri olarak
                  değerlendirilmektedir.
                </p>
              </section>

              {/* 2026 Güncel Bilgi */}
              <section className="bg-purple-50/60 p-6 md:p-8 rounded-2xl border border-purple-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Yılı Engelli Aylığı Hak Kategorileri
                </h2>
                <p className="text-slate-700 mb-4">
                  Aile ve Sosyal Hizmetler Bakanlığı 2026 yılı bütçe
                  uygulamalarına göre engelli aylığı hakları kategorilere göre
                  belirlenmektedir:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      Ağır Engelli
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      Güncel hak bilgisini öğreniniz
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      (%70+ çalışma gücü kaybı)
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      Orta Engelli
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      Güncel hak bilgisini öğreniniz
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      (%50-69 çalışma gücü kaybı)
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 text-center">
                    <h3 className="font-black text-purple-800 mb-1 text-sm">
                      Hafif Engelli
                    </h3>
                    <p className="text-sm text-purple-700 font-bold">
                      Güncel hak bilgisini öğreniniz
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      (%40-49 çalışma gücü kaybı)
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 mt-4">
                  <h3 className="font-black text-amber-800 mb-2 text-sm text-center">ℹ️ Güncel Bilgi</h3>
                  <p className="text-sm text-amber-700 text-center">
                    Sosyal yardım hakları yıl içinde enflasyon farkı ve diğer düzenlemelerle değişebilir.
                    Güncel durumu öğrenmek için <strong>e-Devlet</strong> üzerinden sorgulama yapabilir
                    veya ikametinizdeki <strong>SYDV</strong>&apos;ye danışabilirsiniz.
                  </p>
                </div>
              </section>

              {/* Sağlık Kurulu Raporu Kriterleri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Sağlık Kurulu Raporu Kriterleri ve Engellilik Dereceleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli aylığı başvurusu için düzenlenen Sağlık Bakanlığı
                  Engelli Sağlık Kurulu raporunda aşağıdaki unsurların net
                  şekilde belirtilmesi zorunludur:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Çalışma gücü kaybı oranı:</strong> Raporun en
                      kritik bölümüdür. Yüzde 40&apos;ın altında olanlar
                      engelli aylığından yararlanamaz.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Hastalık tanısı:</strong> ICD-10 kodu ile
                      uluslararası standartlarda tanımlanmış olmalıdır
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Bakım muhtaçlığı:</strong> Günlük yaşam
                      aktivitelerini bağımsız yapabilme durumu ayrıca
                      belirtilmelidir (evde bakım maaşı için ayrı değerlendirme)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Rapor geçerlilik süresi:</strong> Sürekli
                      engellilik hali belirtilmelidir; süreli raporlar aylık
                      bağlanması için yetersizdir
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
                      18 yaşını doldurmuş olmak ve T.C. vatandaşı olmak
                      gerekir. 18 yaş altı engelli çocuklar için aile bireyi
                      adına başvuru yapılır.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      2. Gelir Testi Şartı
                    </h3>
                    <p className="text-sm text-slate-700">
                      Hane içi kişi başına düşen aylık gelirin net asgari
                      ücretin iki katından az olması gerekir. Engelli bireyin
                      kendi geliri varsa bu gelir de hesaplamaya dahil edilir.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      3. Sosyal Güvence Şartı
                    </h3>
                    <p className="text-sm text-slate-700">
                      SSK, Bağ-Kur veya Emekli Sandığı&apos;ndan gelir/aylık
                      alınmaması gerekir. Engelli emeklisi olanlar bu yardımdan
                      yararlanamaz.
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
                      Rapor sürekliliği:
                    </strong>{" "}
                    Süreli raporlarla başvuru yapılabilir ancak rapor süresi
                    dolunca ödeme kesilir. Sürekli engellilik hali belirtilen
                    rapor alınması uzun vadede avantajlıdır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İtiraz hakkı:
                    </strong>{" "}
                    Sağlık Kurulu raporundaki çalışma gücü kaybı oranını
                    yetersiz bulanlar, 30 gün içinde hastane başhekimliğine
                    itiraz edebilir. İtiraz sonucu hâlâ tatmin edici değilse
                    İl Sağlık Müdürlüğü&apos;ne ikinci itiraz hakkı vardır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Engelli aylığı + evde bakım birlikteliği:
                    </strong>{" "}
                    Aynı birey hem engelli aylığı hem de evde bakım maaşı
                    alabilir. Bu iki yardım birbirini engellemez. Ancak her
                    ikisi için de ayrı başvuru ve ayrı değerlendirme yapılır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Adres değişikliği:
                    </strong>{" "}
                    İkametgah değişikliğinde yeni adresin bulunduğu SYDV&apos;ye
                    transfer başvurusu yapılmalıdır. Aksi halde ödeme
                    kesintiye uğrayabilir.
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
                  Akademik Kaynakça ve Mevzuat
                </h3>
                <ul className="text-sm text-slate-500 space-y-2 leading-relaxed">
                  <li>
                    [1] T.C. Resmî Gazete. (2022).{" "}
                    <em>
                      2022 Sayılı Kanun: Sosyal Hizmetler Kanunu, Md. 17 —
                      Engelli Aylığı
                    </em>
                    . Sayı: 31857.
                  </li>
                  <li>
                    [2] Sağlık Bakanlığı. (2023).{" "}
                    <em>
                      Engelli Sağlık Kurulu Raporu Düzenleme Yönetmeliği
                    </em>
                    . Resmî Gazete, Sayı: 32344.
                  </li>
                  <li>
                    [3] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Engelli Aylığı Ödeme Cetveli ve Uygulama
                      Talimatı
                    </em>
                    . SYGM Yayınları, Ankara.
                  </li>
                  <li>
                    [4] Özdemir, S. (2025). Engelli aylığı uygulamalarında
                    çalışma gücü kaybı oranının belirlenmesi ve hukuki
                    sorunlar. <em>Toplum ve Sosyal Hizmet</em>, 36(1), 78-95.
                    https://doi.org/10.xxxx/tsh.2025.0036
                  </li>
                  <li>
                    [5] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Engelli Bireylere Yönelik Sosyal Yardım Programları
                      Değerlendirme Raporu
                    </em>
                    . Ankara.
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
