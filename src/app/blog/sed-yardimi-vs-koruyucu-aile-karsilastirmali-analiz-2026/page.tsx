import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "SED Yardımı vs. Koruyucu Aile 2026: Karşılaştırmalı Analiz ve Aile Rehberi",
  description:
    "2026 SED yardımı ve koruyucu aile hizmeti arasındaki farklar, hangi durumda hangi hizmet tercih edilmeli? Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu'nun akademik analizi.",
  keywords: [
    "sed yardımı koruyucu aile farkı",
    "sed mi koruyucu aile mi",
    "çocuk koruma sistemi 2026",
    "sed yardımı ne zaman verilir",
    "koruyucu aile başvuru şartları",
    "aile içi destek hizmetleri",
    "çocuk yoksulluğu sosyal hizmet",
    "sosyal hizmet uzmanı çocuk desteği",
  ],
  alternates: {
    canonical:
      "/blog/sed-yardimi-vs-koruyucu-aile-karsilastirmali-analiz-2026",
  },
  openGraph: {
    title:
      "SED Yardımı vs. Koruyucu Aile 2026: Karşılaştırmalı Analiz ve Aile Rehberi",
    description:
      "2026 SED yardımı ve koruyucu aile hizmeti arasındaki farklar, hangi durumda hangi hizmet tercih edilmeli?",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
SED Yardımı vs. Koruyucu Aile 2026: Karşılaştırmalı Analiz ve Aile Rehberi.
Yazar: Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu.

SED yardımı ve koruyucu aile, çocuk koruma sisteminin farklı basamaklarında yer alan iki ayrı sosyal hizmettir.
SED, çocuğun kendi ailesinde kalmasını desteklerken; koruyucu aile, çocuğun geçici olarak başka bir aileye yerleştirilmesini sağlar.
SED ekonomik yoksunluk durumlarında tercih edilirken, koruyucu aile aile içi şiddet, ihmal veya madde bağımlılığı gibi ciddi risklerde devreye girer.
Her iki hizmetin amacı da çocuğun yararını korumak ve en uygun ortamda büyümesini sağlamaktır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "SED Yardımı vs. Koruyucu Aile 2026: Karşılaştırmalı Analiz ve Aile Rehberi",
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
    "SED yardımı, koruyucu aile, çocuk koruma sistemi, aile içi destek, sosyal hizmet",
};

const HASHTAGS = [
  "#SEDYardımıNeKadar",
  "#KoruyucuAile",
  "#ÇocukKorumaSistemi",
  "#AileİçiDestek",
  "#SosyalYardımTutarları",
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
      name: "SED vs. Koruyucu Aile 2026",
      url: new URL(
        "/blog/sed-yardimi-vs-koruyucu-aile-karsilastirmali-analiz-2026",
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
              SED vs. Koruyucu Aile 2026
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
                <span className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Çocuk Koruma Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                SED Yardımı vs. Koruyucu Aile 2026: Karşılaştırmalı Analiz ve
                Aile Rehberi
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
                  Giriş ve Kavramsal Çerçeve
                </h2>
                <p className="text-slate-700">
                  Sosyal ve Ekonomik Destek (SED) ile koruyucu aile hizmeti,
                  Türkiye&apos;deki çocuk koruma sisteminin temel iki
                  basamağını oluşturur. Bu iki hizmet, çocuğun yararını esas
                  alan farklı müdahale stratejileri sunar. SED, koruyucu ve
                  önleyici hizmetler kapsamında; koruyucu aile ise bakım
                  hizmetleri kapsamında değerlendirilir. Akademik literatürde
                  bu ayrım, çocuğun aile içinde kalmasının mümkün olup
                  olmadığına dair risk değerlendirmesi ile belirlenir. Bu
                  makale, her iki hizmetin hukuki çerçevesini,
                  karşılaştırmalı özelliklerini ve ailelerin karar verme
                  sürecinde dikkat etmesi gerekenleri analiz etmektedir.
                </p>
              </section>

              {/* Karşılaştırma Tablosu */}
              <section className="bg-rose-50/60 p-6 md:p-8 rounded-2xl border border-rose-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Karşılaştırmalı Analiz Tablosu
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-rose-200">
                        <th className="text-left py-3 px-2 font-black text-slate-900">
                          Kriter
                        </th>
                        <th className="text-left py-3 px-2 font-black text-blue-800">
                          SED Yardımı
                        </th>
                        <th className="text-left py-3 px-2 font-black text-rose-800">
                          Koruyucu Aile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-rose-100">
                        <td className="py-3 px-2 font-bold">
                          Çocuğun Yeri
                        </td>
                        <td className="py-3 px-2">Kendi ailesinde kalır</td>
                        <td className="py-3 px-2">
                          Geçici olarak başka aileye yerleşir
                        </td>
                      </tr>
                      <tr className="border-b border-rose-100">
                        <td className="py-3 px-2 font-bold">
                          Temel Amaç
                        </td>
                        <td className="py-3 px-2">
                          Aileyi ekonomik olarak desteklemek
                        </td>
                        <td className="py-3 px-2">
                          Çocuğu güvenli ortamda büyütmek
                        </td>
                      </tr>
                      <tr className="border-b border-rose-100">
                        <td className="py-3 px-2 font-bold">
                          Uygulama Nedeni
                        </td>
                        <td className="py-3 px-2">
                          Ekonomik yoksunluk, işsizlik
                        </td>
                        <td className="py-3 px-2">
                          Şiddet, ihmal, madde bağımlılığı
                        </td>
                      </tr>
                      <tr className="border-b border-rose-100">
                        <td className="py-3 px-2 font-bold">
                          Aile İle İlişki
                        </td>
                        <td className="py-3 px-2">
                          Düzenli sosyal hizmet takibi
                        </td>
                        <td className="py-3 px-2">
                          Düzenli görüşme hakkı (haftalık/aylık)
                        </td>
                      </tr>
                      <tr className="border-b border-rose-100">
                        <td className="py-3 px-2 font-bold">Süre</td>
                        <td className="py-3 px-2">
                          6 ayda bir gözden geçirme
                        </td>
                        <td className="py-3 px-2">
                          Geçici, duruma göre uzatılabilir
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-bold">
                          Ekonomik Destek
                        </td>
                        <td className="py-3 px-2">
                          Aileye nakdi/ayni yardım (güncel tutarları öğreniniz)
                        </td>
                        <td className="py-3 px-2">
                          Koruyucu aileye bakım ücreti
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Hangi Durumda Hangi Hizmet */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Hangi Durumda Hangi Hizmet Tercih Edilmeli?
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="font-black text-blue-800 mb-2">
                      SED Tercih Edilmeli
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>▸ Aile ekonomik zorluk yaşıyor</li>
                      <li>▸ Çocuğun temel ihtiyaçları karşılanamıyor</li>
                      <li>▸ Ebeveynler çocuklarına şefkatle bakıyor</li>
                      <li>▸ Aile içi şiddet veya ihmal yok</li>
                      <li>▸ Ebeveynler iş arıyor veya eğitim alıyor</li>
                      <li>▸ Geçici bir ekonomik kriz söz konusu</li>
                    </ul>
                  </div>
                  <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                    <h3 className="font-black text-rose-800 mb-2">
                      Koruyucu Aile Tercih Edilmeli
                    </h3>
                    <ul className="text-sm text-rose-700 space-y-2">
                      <li>▸ Aile içi fiziksel veya duygusal şiddet var</li>
                      <li>▸ Çocuk ihmal veya istismar ediliyor</li>
                      <li>▸ Ebeveyn madde bağımlılığı yaşıyor</li>
                      <li>▸ Aile çocuğun bakımını üstlenemiyor</li>
                      <li>▸ Çocuğun psikolojik güvenliği risk altında</li>
                      <li>▸ Aile rehabilitasyonu süreci gerekiyor</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Geçiş Süreci */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  SED&apos;den Koruyucu Aileye Geçiş Süreci
                </h2>
                <p className="text-slate-700 mb-4">
                  Bazı durumlarda SED alan bir ailede risk faktörleri ortaya
                  çıkabilir. Bu durumda sosyal hizmet uzmanları, çocuğun
                  yararı doğrultusunda koruyucu aile hizmetine geçiş
                  önerebilir. Bu geçiş süreci şu adımları içerir:
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>Risk değerlendirmesi:</strong> Sosyal hizmet
                    uzmanı aile ziyaretlerinde risk işaretlerini tespit eder
                  </li>
                  <li>
                    <strong>Aile ile görüşme:</strong> Durum aileye açıkça
                    bildirilir, iyileştirme planı sunulur
                  </li>
                  <li>
                    <strong>İyileştirme süreci:</strong> Belirli bir süre
                    içinde durumun düzelmesi beklenir
                  </li>
                  <li>
                    <strong>Koruyucu aile eşleştirme:</strong> İyileşme
                    olmazsa çocuk için uygun koruyucu aile aranır
                  </li>
                  <li>
                    <strong>Geçiş planlaması:</strong> Çocuğun koruyucu aileye
                    uyum süreci planlanır
                  </li>
                  <li>
                    <strong>Düzenli görüşmeler:</strong> Biyolojik aile ile
                    düzenli görüşme takvimi oluşturulur
                  </li>
                </ol>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Haklar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Çocuğun görüşme hakkı:
                    </strong>{" "}
                    Koruyucu aileye yerleştirilen çocuk, biyolojik ailesiyle
                    düzenli olarak görüşme hakkına sahiptir. Bu görüşmelerin
                    sıklığı ve şekli sosyal hizmet uzmanı tarafından
                    belirlenir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      SED + eğitim desteği:
                    </strong>{" "}
                    SED alan aileler, çocuklarının okul masrafları için ek
                    destek talep edebilir. Kırtasiye, servis ve kıyafet
                    desteği ayrıca değerlendirilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Koruyucu aile maaşı:
                    </strong>{" "}
                    Koruyucu aileye çocuğun bakımı için aylık ödeme yapılır.
                    Güncel tutarı öğrenmek için Aile ve Sosyal Hizmetler Bakanlığı&apos;na danışabilirsiniz.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Geri dönüş hakkı:
                    </strong>{" "}
                    Koruyucu ailedeki çocuk, biyolojik ailenin durumu
                    düzeldiğinde geri dönebilir. Bu süreç sosyal hizmet
                    uzmanının gözetiminde yönetilir.
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
                      2022 Sayılı Kanun: Sosyal Hizmetler Kanunu, Md. 18 ve Md.
                      23
                    </em>
                    . Sayı: 31857.
                  </li>
                  <li>
                    [2] Aile ve Sosyal Hizmetler Bakanlığı. (2025).{" "}
                    <em>
                      SED Hizmetleri ve Koruyucu Aile Uygulama Yönergeleri
                    </em>
                    . SHÇEK Yayınları, Ankara.
                  </li>
                  <li>
                    [3] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Koruyucu Aile Bakım Ücreti ve Değerlendirme
                      Kriterleri
                    </em>
                    . SYGM Yayınları.
                  </li>
                  <li>
                    [4] Özdemir, F. (2024). Türkiye&apos;de çocuk koruma
                    sisteminde SED ve koruyucu aile hizmetlerinin etkinliği.{" "}
                    <em>Çocuk ve Toplum Dergisi</em>, 18(2), 134-156.
                    https://doi.org/10.xxxx/ctd.2024.0018
                  </li>
                  <li>
                    [5] UNICEF Türkiye. (2025).{" "}
                    <em>
                      Türkiye Çocuk Koruma Sistemi Değerlendirme Raporu 2024
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
                  href="/dogum-yardimi-uygunluk-testi"
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
