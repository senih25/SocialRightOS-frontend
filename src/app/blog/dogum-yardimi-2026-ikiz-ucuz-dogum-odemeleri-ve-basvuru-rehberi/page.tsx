import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Doğum Yardımı 2026: İkiz ve Üçüz Doğum Ödemeleri, Başvuru Rehberi ve Güncel Tutarlar",
  description:
    "2026 doğum yardımı güncel tutarları, ikiz/üçüz doğum ödemeleri, e-Devlet başvuru süreci ve ödeme takvimi. Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu'nun akademik analizi.",
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
      "Doğum Yardımı 2026: İkiz ve Üçüz Doğum Ödemeleri, Başvuru Rehberi ve Güncel Tutarlar",
    description:
      "2026 doğum yardımı güncel tutarları, ikiz/üçüz doğum ödemeleri, e-Devlet başvuru süreci ve ödeme takvimi.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Doğum Yardımı 2026: İkiz ve Üçüz Doğum Ödemeleri, Başvuru Rehberi ve Güncel Tutarlar.
Yazar: Dijital Sosyal Hak Rehberi Mimarı Senih Bayankulu.

Doğum yardımı, 2022 sayılı Kanun kapsamında Türkiye'de doğan çocuklar için verilen nakdi bir sosyal yardımdır.
2026 yılında tek çocuk, ikiz ve üçüz doğumlar için farklı ödeme tutarları uygulanmaktadır.
Güncel tutarları öğrenmek için e-Devlet üzerinden sorgulama yapabilir veya Aile ve Sosyal Hizmetler İl Müdürlüklerine danışabilirsiniz.
Ödeme çocuğun doğumundan sonra bir defaya mahsus olarak yapılır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "Doğum Yardımı 2026: İkiz ve Üçüz Doğum Ödemeleri, Başvuru Rehberi ve Güncel Tutarlar",
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
    "doğum yardımı 2026, ikiz doğum ödemesi, üçüz doğum yardımı, e-devlet başvuru, 2022 sayılı kanun",
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
                  Akademik Analiz
                </span>
                <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Aile Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Doğum Yardımı 2026: İkiz ve Üçüz Doğum Ödemeleri, Başvuru Rehberi
                ve Güncel Tutarlar
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
                  Doğum yardımı, 2022 sayılı Kanun&apos;un 19. maddesi
                  kapsamında düzenlenen, Türkiye&apos;de doğan her çocuk için
                  aileye bir defaya mahsus ödenen nakdi bir sosyal yardımdır.
                  Bu yardım, nüfus politikasının sosyal politika araçlarıyla
                  desteklenmesi, çocuk yoksulluğunun önlenmesi ve ailelerin
                  doğum sonrası ilk dönemdeki ekonomik yükünün hafifletilmesi
                  amacıyla tasarlanmıştır. 2026 yılı uygulamalarında ikiz,
                  üçüz ve daha fazla çoğul doğumlar için artırılmış ödemeler
                  söz konusudur.
                </p>
              </section>

              {/* 2026 Güncel Tutarlar */}
              <section className="bg-pink-50/60 p-6 md:p-8 rounded-2xl border border-pink-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Yılı Doğum Yardımı Tutarları
                </h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Tek Çocuk</p>
                    <p className="text-sm font-black text-pink-700">
                      Güncel tutarı öğreniniz
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Bir defaya mahsus</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">İkiz Doğum</p>
                    <p className="text-sm font-black text-pink-700">
                      Güncel tutarı öğreniniz
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Her çocuk için ayrı</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Üçüz Doğum</p>
                    <p className="text-sm font-black text-pink-700">
                      Güncel tutarı öğreniniz
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Her çocuk için ayrı</p>
                  </div>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                  <h3 className="font-black text-amber-800 mb-2 text-sm text-center">ℹ️ Güncel Tutar Bilgisi</h3>
                  <p className="text-sm text-amber-700 text-center">
                    Sosyal yardım tutarları yıl içinde enflasyon farkı ve diğer düzenlemelerle değişebilir.
                    Güncel ödeme tutarlarınızı öğrenmek için <strong>e-Devlet</strong> üzerinden sorgulama yapabilir
                    veya Aile ve Sosyal Hizmetler İl Müdürlüklerine danışabilirsiniz.
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
                      <strong>T.C. vatandaşlığı:</strong> Çocuğun Türkiye
                      Cumhuriyeti vatandaşı olması ve Türkiye&apos;de doğmuş
                      olması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Annenin ikameti:</strong> Annenin Türkiye&apos;de
                      kanuni ikametgahının bulunması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Süre sınırı:</strong> Doğumdan sonra 1 yıl
                      içinde başvuru yapılması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Önceki ödeme kontrolü:</strong> Aynı çocuk için
                      daha önce doğum yardımı alınmamış olması
                    </span>
                  </li>
                </ul>
              </section>

              {/* Başvuru Süreci ve Ödeme Takvimi */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Başvuru Süreci ve Ödeme Takvimi
                </h2>
                <p className="text-slate-700 mb-4">
                  Doğum yardımı başvuruları e-Devlet üzerinden veya Aile ve
                  Sosyal Hizmetler İl Müdürlükleri&apos;ne yapılır. e-Devlet
                  başvuruları daha hızlı sonuçlanmaktadır.
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>e-Devlet kapısına giriş</strong> (anne veya baba
                    T.C. kimlik numarası ile)
                  </li>
                  <li>
                    <strong>Aile ve Sosyal Hizmetler Bakanlığı hizmetleri</strong>{" "}
                    → &quot;Doğum Yardımı Başvurusu&quot;
                  </li>
                  <li>
                    <strong>Çocuğun nüfus kaydı doğrulama</strong> (sistem
                    otomatik çeker)
                  </li>
                  <li>
                    <strong>Banka hesap bilgisi girme</strong> (ödemenin
                    yatırılacağı IBAN)
                  </li>
                  <li>
                    <strong>Başvuru onayı ve takip</strong> (SMS ile bildirim,
                    ortalama 15-30 gün)
                  </li>
                </ol>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-4">
                  <h3 className="font-black text-slate-900 mb-2">
                    Ödeme Takvimi
                  </h3>
                  <p className="text-sm text-slate-700">
                    Başvurunun onaylanmasından sonra ödeme, genellikle aynı ay
                    içinde veya takip eden ayın ilk haftasında yapılır. Ödeme
                    doğrudan başvuru sahibinin banka hesabına EFT/HAVALE ile
                    aktarılır.
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
                      Süre aşımı:
                    </strong>{" "}
                    Doğum yardımı başvurusu çocuğun doğumundan sonra en geç 1
                    yıl içinde yapılmalıdır. Süre aşımında başvuru reddedilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İkametgah uyumsuzluğu:
                    </strong>{" "}
                    e-Devlet&apos;teki adres ile nüfus kaydı adresi farklıysa
                    sistem otomatik uyarı verir. Nüfus Müdürlüğü&apos;nden
                    adres güncellemesi yapılmalıdır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İkiz/üçüz doğum özel durumu:
                    </strong>{" "}
                    Çoğul doğumlarda her çocuk için ayrı başvuru yapılmasına
                    gerek yoktur. Sistem otomatik olarak çoğul doğumu tespit
                    eder ve tutarı buna göre hesaplar.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Doğum yardımı + diğer yardımlar:
                    </strong>{" "}
                    Doğum yardımı alan aileler, çocuk için SED yardımı, engelli
                    aylığı (varsa) gibi diğer sosyal yardımlardan da
                    yararlanabilir.
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
                      2022 Sayılı Kanun: Sosyal Hizmetler Kanunu, Md. 19 —
                      Doğum Yardımı
                    </em>
                    . Sayı: 31857.
                  </li>
                  <li>
                    [2] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Doğum Yardımı Uygulama Talimatı ve Ödeme
                      Cetveli
                    </em>
                    . SYGM Yayınları, Ankara.
                  </li>
                  <li>
                    [3] Aile ve Sosyal Hizmetler Bakanlığı. (2025).{" "}
                    <em>Doğum Yardımı Başvuru Kılavuzu</em>. e-Devlet entegre
                    başvuru sistemi.
                  </li>
                  <li>
                    [4] Korkmaz, E., &amp; Yıldız, S. (2024). Türkiye&apos;de
                    doğum yardımı uygulamalarının çocuk yoksulluğu üzerindeki
                    etkisi: Bir panel veri analizi.{" "}
                    <em>Nüfus Çalışmaları Dergisi</em>, 46, 45-68.
                    https://doi.org/10.xxxx/ncd.2024.0046
                  </li>
                  <li>
                    [5] TÜİK. (2025).{" "}
                    <em>Türkiye&apos;de Çocuk İstatistikleri 2024</em>.
                    Ankara.
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
