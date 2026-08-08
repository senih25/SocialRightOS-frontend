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
    "Doğum Yardımı 2026: Resmî Başvuru Rehberi ve Güncel Tutarlar",
  description:
    "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî doğum yardımı sayfalarına göre 2026 güncel tutarlar, başvuru kanalları ve çocuk sırasına bağlı ödeme yapısı.",
  keywords: [
    "doğum yardımı 2026",
    "doğum yardımı ne kadar 2026",
    "ikiz doğum yardımı 2026",
    "üçüz doğum yardımı",
    "doğum yardımı başvuru şartları",
    "doğum yardımı e-devlet",
    "çocuk yardımı 2026",
    "doğum ödeme takvimi 2026",
  ],
  alternates: {
    canonical:
      "/blog/dogum-yardimi-2026-ikiz-ucuz-dogum-odemeleri-ve-basvuru-rehberi",
  },
  openGraph: {
    title:
      "Doğum Yardımı 2026: Resmî Başvuru Rehberi ve Güncel Tutarlar",
    description:
      "Aile ve Sosyal Hizmetler Bakanlığı’nın resmî doğum yardımı sayfalarına göre 2026 güncel tutarlar, başvuru kanalları ve çocuk sırasına bağlı ödeme yapısı.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Doğum Yardımı 2026: Resmî Başvuru Rehberi ve Güncel Tutarlar.
Yazar: Senih Bayankulu.

Doğum yardımı, 01.01.2025 tarihi ve sonrasında canlı doğan çocuklar için verilen nakdi bir sosyal yardımdır.
2026 yılında ödeme çocuk sırasına göre belirlenir: ilk çocuk için tek seferlik ödeme, ikinci çocuk için aylık ödeme ve üçüncü ile sonraki çocuklar için daha yüksek aylık ödeme uygulanır.
Başvurular e-Devlet üzerinden yapılır; ödeme ve süreç bilgileri resmî bakanlık sayfaları ile e-Ailem üzerinden izlenebilir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Doğum Yardımı 2026: Resmî Başvuru Rehberi ve Güncel Tutarlar",
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
    "doğum yardımı 2026, doğum yardımı başvuru, e-devlet, e-ailem, çocuk sırası, aile ve sosyal hizmetler bakanlığı",
};

const HASHTAGS = [
  "#DoğumYardımıTutarı",
  "#SosyalYardımTutarları",
  "#İkizDoğum",
  "#ÜçüzDoğum",
  "#AileveSosyalHizmetler",
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
      name: "Doğum Yardımı 2026",
      url: new URL(
        "/blog/dogum-yardimi-2026-ikiz-ucuz-dogum-odemeleri-ve-basvuru-rehberi",
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
            <span className="text-slate-900 font-bold">Doğum Yardımı 2026</span>
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
                <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Aile Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Doğum Yardımı 2026: Resmî Başvuru Rehberi ve Güncel Tutarlar
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
                  Doğum yardımı, 01.01.2025 tarihi ve sonrasında canlı doğan
                  çocuklar için aileye bir defaya mahsus ödenen nakdi bir
                  sosyal yardımdır.
                  Bu yardım, ailelerin doğum sonrası ilk dönemdeki ekonomik
                  yükünü hafifletmeyi amaçlar. 2026 yılı uygulamalarında
                  ödeme çocuk sırasına göre belirlenir; çoğul doğumlarda sıra
                  esaslı tutar uygulanır.
                </p>
              </section>

              {/* 2026 Güncel Tutarlar */}
              <section className="bg-pink-50/60 p-6 md:p-8 rounded-2xl border border-pink-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Yılı Doğum Yardımı Tutar Yapısı
                </h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">İlk Çocuk</p>
                    <p className="text-sm font-black text-pink-700">
                      5.000 TL
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Tek seferlik ödeme</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">İkinci Çocuk</p>
                    <p className="text-sm font-black text-pink-700">
                      Aylık 1.500 TL
                    </p>
                    <p className="text-xs text-slate-400 mt-1">60 aya kadar</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Üçüncü ve Sonraki</p>
                    <p className="text-sm font-black text-pink-700">
                      Aylık 5.000 TL
                    </p>
                    <p className="text-xs text-slate-400 mt-1">60 aya kadar</p>
                  </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                  <h3 className="font-black text-amber-800 mb-2 text-sm text-center">ℹ️ Güncel Tutar Bilgisi</h3>
                  <p className="text-sm text-amber-700 text-center">
                    Sosyal yardım tutarları resmî bakanlık sayfalarında yayımlanır.
                    Başvuru sonucu ve ödeme bilgileri için <strong>e-Devlet</strong>,
                    <strong> e-Ailem</strong> ve ilgili bakanlık duyuruları takip edilmelidir.
                    TÜİK&apos;in çocuk istatistikleri, doğum yardımı politikasının demografik
                    arka planını gösterir.
                  </p>
                </div>
              </section>

              {/* Başvuru Şartları */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Başvuru Şartları ve Kimler Faydalanabilir?
                </h2>
                <p className="text-slate-700 mb-4">
                  Doğum yardımından faydalanmak için aşağıdaki şartların
                  sağlanması gerekmektedir:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Vatandaşlık ve doğum tarihi:</strong> Çocuğun
                      01.01.2025 sonrasında canlı doğmuş olması ve resmî
                      kayıtla doğrulanması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Başvuru kanalı:</strong> Başvurunun başvuru
                      sahibinin kendi e-Devlet hesabı üzerinden yapılması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Takip imkânı:</strong> Başvuru ve ödeme
                      sürecinin e-Devlet ile e-Ailem üzerinden izlenebilmesi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Sıra esaslı ödeme:</strong> Çocuk sırasına göre
                      tek seferlik veya aylık ödeme uygulanması
                    </span>
                  </li>
                </ul>
              </section>

              {/* Başvuru Süreci ve Ödeme Takvimi */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Başvuru Süreci ve İzleme Kanalları
                </h2>
                <p className="text-slate-700 mb-4">
                  Doğum yardımı başvuruları e-Devlet üzerinden yürütülür.
                  Başvuru sonucu ve ödeme bilgileri için e-Ailem ile resmî
                  bakanlık duyuruları takip edilmelidir.
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>e-Devlet kapısına giriş</strong> (başvuru sahibinin
                    kendi hesabı ile)
                  </li>
                  <li>
                    <strong>Aile ve Sosyal Hizmetler Bakanlığı hizmetleri</strong>{" "}
                    → &quot;Doğum Yardımı Başvurusu&quot;
                  </li>
                  <li>
                    <strong>Çocuk sırası ve kimlik doğrulama</strong> (nüfus
                    kaydı üzerinden)
                  </li>
                  <li>
                    <strong>Başvuruyu tamamlama</strong> (gerekli bilgileri
                    kontrol ederek)
                  </li>
                  <li>
                    <strong>Sonuç ve ödeme takibi</strong> (e-Devlet ve
                    bakanlık duyuruları üzerinden)
                  </li>
                </ol>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-4">
                  <h3 className="font-black text-slate-900 mb-2">
                    Ödeme Bilgisi
                  </h3>
                  <p className="text-sm text-slate-700">
                    Ödeme takvimi ve hak ediş bilgileri resmî bakanlık
                    duyurularında yayımlanır. Ödeme süreci çocuk sırasına göre
                    hesaplanır ve başvuru sonucu dijital kanallardan izlenir.
                  </p>
                </div>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Sık Karşılaşılan Sorunlar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Başvuru süresi:
                    </strong>{" "}
                    Başvuru süresi resmî başvuru kılavuzunda belirtilen süre
                    içinde tamamlanmalıdır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Kimlik ve kayıt uyumu:
                    </strong>{" "}
                    Başvuru sahibinin ve çocuğun kimlik/kayıt bilgileri resmî
                    kayıtlarda uyumlu değilse başvuru ek doğrulama gerektirebilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Çoğul doğum özel durumu:
                    </strong>{" "}
                    Çoğul doğumlarda ödeme, çocuk sırasına göre hesaplanır;
                    her çocuk için tutar ayrı değerlendirilir.
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
                      Doğum Yardımı
                    </em>
                    . Resmî SSS sayfası.
                  </li>
                  <li>
                    [2] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      e-Ailem
                    </em>
                    . Dijital başvuru ve takip bilgilendirmesi.
                  </li>
                  <li>
                    [3] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>Sosyal Yardım Programlarımız</em>. SYGM program tablosu.
                  </li>
                  <li>
                    [4] Türkiye İstatistik Kurumu (TÜİK). (2025).{" "}
                    <em>İstatistiklerle Çocuk 2024</em>. Çocuk nüfusu ve
                    doğurganlık göstergeleri için resmî demografik yayın.
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
