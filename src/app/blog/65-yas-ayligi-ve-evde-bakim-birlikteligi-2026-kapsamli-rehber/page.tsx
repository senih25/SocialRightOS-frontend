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
    "65 Yaş Aylığı ve Evde Bakım Maaşı Birlikteliği 2026: Kapsamlı Rehber ve Uygulama İpuçları",
  description:
    "2026'da 65 yaş aylığı ve evde bakım maaşı birlikte alınabilir mi? Gelir testi, başvuru şartları ve pratik uygulama rehberi. Bilgilendirme amacıyla hazırlanmış rehber.",
  keywords: [
    "65 yaş aylığı evde bakım birlikte",
    "yaşlılık maaşı bakım parası 2026",
    "65 yaş aylığı evde bakım maaşı aynı anda",
    "ikili yardım başvurusu 2026",
    "yaşlı bakım ücreti 2026",
    "65 yaş aylığı gelir sınırı evde bakım",
    "sosyal yardım birleştirme 2026",
    "yaşlı ve engelli bakım desteği",
  ],
  alternates: {
    canonical:
      "/blog/65-yas-ayligi-ve-evde-bakim-birlikteligi-2026-kapsamli-rehber",
  },
  openGraph: {
    title:
      "65 Yaş Aylığı ve Evde Bakım Maaşı Birlikteliği 2026: Kapsamlı Rehber ve Uygulama İpuçları",
    description:
      "2026'da 65 yaş aylığı ve evde bakım maaşı birlikte alınabilir mi? Gelir testi, başvuru şartları ve pratik uygulama rehberi.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
65 Yaş Aylığı ve Evde Bakım Maaşı Birlikteliği 2026: Kapsamlı Rehber ve Uygulama İpuçları.
Yazar: Senih Bayankulu.

65 yaş aylığı ve evde bakım maaşı birbirini engellemeyen iki ayrı sosyal yardımdır.
2026 yılında her iki yardımı aynı anda almak mümkündür ancak her biri için ayrı başvuru ve ayrı değerlendirme yapılır.
65 yaş aylığı için hane içi kişi başına düşen gelirin asgari ücretin üçte birinden az olması gerekirken, evde bakım maaşı için bu oran net asgari ücretin üçte ikisinden azdır.
Her iki yardımın birlikte alınması durumunda toplam haklar, güncel mevzuat ve kurum değerlendirmesine göre şekillenir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "65 Yaş Aylığı ve Evde Bakım Maaşı Birlikteliği 2026: Kapsamlı Rehber ve Uygulama İpuçları",
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
    "65 yaş aylığı evde bakım birlikteliği, ikili yardım, yaşlı bakım desteği, gelir testi, 2026",
};

const HASHTAGS = [
  "#65YaşAylığıNeKadar",
  "#EvdeBakımMaaşı2026",
  "#İkiliYardım",
  "#YaşlıBakımDesteği",
  "#2026Güncel",
  "#SosyalHaklar",
  "#SYDV",
  "#SosyalYardımHakları",
];

export default function Page() {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog ve Analiz", url: new URL("/blog", siteUrl).toString() },
    {
      name: "65 Yaş Aylığı ve Evde Bakım Birlikteliği 2026",
      url: new URL(
        "/blog/65-yas-ayligi-ve-evde-bakim-birlikteligi-2026-kapsamli-rehber",
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
              65 Yaş Aylığı ve Evde Bakım Birlikteliği 2026
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
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Karşılaştırmalı Rehber
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                65 Yaş Aylığı ve Evde Bakım Maaşı Birlikteliği 2026: Kapsamlı
                Rehber ve Uygulama İpuçları
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
                  Giriş ve Temel Soru: İki Yardım Birlikte Alınabilir mi?
                </h2>
                <p className="text-slate-700">
                  65 yaş aylığı ile evde bakım maaşı, Türkiye&apos;deki sosyal
                  yardım sisteminin en sık karıştırılan iki unsurudur. Birçok
                  vatandaş, bu iki yardımın birbirini engellediğini
                  düşünmektedir. Oysa 2022 sayılı Kanun ve ilgili
                  yönetmeliklerde bu iki yardım birbirinden bağımsız
                  düzenlenmiştir. 2026 yılı uygulamalarında, belirli şartları
                  sağlayan yaşlı bireyler her iki yardımı da aynı anda
                  alabilmektedir. Bu makale, bu birlikteliğin hukuki
                  çerçevesini, başvuru şartlarını ve pratik uygulama
                  yönergelerini akademik düzeyde analiz etmektedir.
                </p>
              </section>

              {/* Karşılaştırma Tablosu */}
              <section className="bg-teal-50/60 p-6 md:p-8 rounded-2xl border border-teal-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Yılı Karşılaştırma Tablosu
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-teal-200">
                        <th className="text-left py-3 px-2 font-black text-slate-900">
                          Kriter
                        </th>
                        <th className="text-left py-3 px-2 font-black text-emerald-800">
                          65 Yaş Aylığı
                        </th>
                        <th className="text-left py-3 px-2 font-black text-cyan-800">
                          Evde Bakım Maaşı
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                    <tr className="border-b border-teal-100">
                        <td className="py-3 px-2 font-bold">Aylık Bilgi</td>
                        <td className="py-3 px-2" colSpan={2}>
                          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                            <h3 className="font-black text-amber-800 mb-2">ℹ️ Güncel Bilgi</h3>
                            <p className="text-sm text-amber-700">
                              Sosyal yardım hakları yıl içinde enflasyon farkı ve diğer düzenlemelerle değişebilir.
                              Güncel durumu öğrenmek için <strong>e-Devlet</strong> üzerinden sorgulama yapabilir
                              veya ikametinizdeki <strong>SYDV</strong>&apos;ye danışabilirsiniz.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-teal-100">
                        <td className="py-3 px-2 font-bold">Yaş Şartı</td>
                        <td className="py-3 px-2">65+</td>
                        <td className="py-3 px-2">Yaş sınırı yok</td>
                      </tr>
                      <tr className="border-b border-teal-100">
                        <td className="py-3 px-2 font-bold">Engellilik</td>
                        <td className="py-3 px-2">Şart değil</td>
                        <td className="py-3 px-2">
                          Ağır engelli raporu (%50+)
                        </td>
                      </tr>
                      <tr className="border-b border-teal-100">
                        <td className="py-3 px-2 font-bold">Gelir Sınırı</td>
                        <td className="py-3 px-2">
                          Asgari ücretin 1/3&apos;ü
                        </td>
                        <td className="py-3 px-2">
                          Net asgari ücretin 2/3&apos;ü
                        </td>
                      </tr>
                      <tr className="border-b border-teal-100">
                        <td className="py-3 px-2 font-bold">
                          Sosyal Güvence
                        </td>
                        <td className="py-3 px-2">Gelir almamak</td>
                        <td className="py-3 px-2">Gelir almamak</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-bold">Başvuru Yeri</td>
                        <td className="py-3 px-2">SYDV</td>
                        <td className="py-3 px-2">SYDV</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Birlikte Alma Şartları */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Her İki Yardımı Birlikte Alma Şartları
                </h2>
                <p className="text-slate-700 mb-4">
                  65 yaşını doldurmuş, ağır engelli raporu olan ve gelir
                  kriterlerini sağlayan bir birey, her iki yardımı da aynı anda
                  alabilir. Ancak burada kritik bir nokta vardır: Her iki
                  yardım için de ayrı başvuru yapılması ve ayrı değerlendirme
                  sürecinden geçilmesi gerekir.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <h3 className="font-black text-emerald-800 mb-2">
                      65 Yaş Aylığı İçin
                    </h3>
                    <ul className="text-sm text-emerald-700 space-y-2">
                      <li>▸ 65 yaşını doldurmuş olmak</li>
                      <li>▸ T.C. vatandaşı olmak</li>
                      <li>▸ SSK/Bağ-Kur/Emekli Sandığı geliri olmamak</li>
                      <li>
                        ▸ Hane geliri kişi başı asgari ücretin 1/3&apos;ünden az
                      </li>
                      <li>▸ Muhtaçlık belgesi (SYDV incelemesi)</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-50 p-5 rounded-2xl border border-cyan-100">
                    <h3 className="font-black text-cyan-800 mb-2">
                      Evde Bakım İçin
                    </h3>
                    <ul className="text-sm text-cyan-700 space-y-2">
                      <li>▸ Ağır engelli raporu (%50+ bakım muhtaçlığı)</li>
                      <li>▸ T.C. vatandaşı olmak</li>
                      <li>▸ SSK/Bağ-Kur/Emekli Sandığı geliri olmamak</li>
                      <li>▸ Hane geliri kişi başı net asgari ücretin 2/3&apos;ünden az</li>
                      <li>▸ Bakımın aile içinde yapılması</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Toplam Gelir Hesaplama */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Toplam Aylık Gelir Hesaplama
                </h2>
                <p className="text-slate-700 mb-4">
                  Her iki yardımı birlikte alan bir bireyin aylık toplam hak
                  durumu, güncel mevzuat ve kurum incelemesine göre değişebilir:
                </p>
                <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 text-center">
                  <h3 className="font-black text-amber-800 mb-2">ℹ️ Güncel Bilgi</h3>
                  <p className="text-sm text-amber-700">
                    Sosyal yardım hakları yıl içinde mevzuat değişiklikleri ve kurum değerlendirmeleriyle güncellenebilir.
                    Güncel durumu öğrenmek için <strong>e-Devlet</strong> üzerinden sorgulama yapabilir
                    veya ikametinizdeki <strong>SYDV</strong>&apos;ye danışabilirsiniz.
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
                      Ayrı başvuru zorunluluğu:
                    </strong>{" "}
                    Her iki yardım için de ayrı başvuru dosyası hazırlanmalıdır.
                    65 yaş aylığı için muhtaçlık belgesi, evde bakım için ise
                    Engelli Sağlık Kurulu raporu zorunludur. Aynı evraklar iki
                    başvuru için de kullanılamaz.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Gelir testi farkı:
                    </strong>{" "}
                    65 yaş aylığı daha dar gelir kriterine sahiptir. Evde bakım
                    maaşı alan bir birey, 65 yaş aylığı için daha katı gelir
                    testinden geçemeyebilir. Bu durumda sadece evde bakım
                    maaşı alınmaya devam edilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Rapor sürekliliği:
                    </strong>{" "}
                    Evde bakım maaşı için kullanılan engelli raporunun süresi
                    dolarsa, 65 yaş aylığı ödenmeye devam eder ancak evde bakım
                    ödemesi durur. Rapor yenileme takvimine dikkat edilmelidir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Adres değişikliği:
                    </strong>{" "}
                    İkametgah değişikliğinde her iki yardım için de ayrı ayrı
                    transfer başvurusu yapılmalıdır. Birinin transferi diğerini
                    otomatik olarak kapsamaz.
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
                  Doğrulama Bekleyen Kaynak Notları
                </h3>
                <ul className="text-sm text-slate-500 space-y-2 leading-relaxed">
                  <li>
                    [1] T.C. Resmî Gazete. (2022).{" "}
                    <em>
                      2022 Sayılı Kanun: Sosyal Hizmetler Kanunu, Md. 14 ve Md.
                      16
                    </em>
                    . Sayı: 31857.
                  </li>
                  <li>
                    [2] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Sosyal Yardım Programları Uygulama Talimatı
                    </em>
                    . SYGM Yayınları, Ankara.
                  </li>
                  <li>
                    [3] Aile ve Sosyal Hizmetler Bakanlığı. (2025).{" "}
                    <em>
                      Birden Fazla Sosyal Yardım Alma Durumları ve
                      Değerlendirme Kılavuzu
                    </em>
                    . Ankara.
                  </li>
                  <li>
                    [4] Sağlık Bakanlığı. (2023).{" "}
                    <em>
                      Engelli Sağlık Kurulu Raporu Düzenleme Yönetmeliği
                    </em>
                    . Resmî Gazete, Sayı: 32344.
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
                  href="/65-yas-ayligi-uygunluk-testi"
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

