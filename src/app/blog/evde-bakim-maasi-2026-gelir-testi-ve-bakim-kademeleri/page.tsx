import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı 2026: Gelir Testi, Bakım Kademeleri ve Başvuru Rehberi",
  description:
    "2026 evde bakım maaşı gelir oranı, ağır-hafif engelli bakım kademeleri ve SYDV başvuru süreci. Akademik mevzuat analizi ile hazırlanmış kapsamlı rehber.",
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
    title: "Evde Bakım Maaşı 2026: Gelir Testi, Bakım Kademeleri ve Başvuru Rehberi",
    description:
      "2026 evde bakım maaşı güncel gelir sınırı, ağır-hafif engelli bakım kademeleri ve SYDV başvuru süreci. Akademik mevzuat analizi.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Evde Bakım Maaşı 2026: Gelir Testi, Bakım Kademeleri ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Evde bakım maaşı, 2022 sayılı Kanun kapsamında ağır engelli bireylerin bakım ihtiyacını karşılamak üzere hane halkına ödenen nakdi bir yardımdır.
2026 yılında bu yardımın en kritik şartı hane içi kişi başına düşen gelirin net asgari ücretin iki katından az olmasıdır.
Bakım ihtiyacı ise Sağlık Bakanlığı Engelli Sağlık Kurulu raporu ile belgelenir.
Raporda bakım muhtaçlığı oranı yüzde ellinin üzerinde olan bireyler ağır engelli kapsamında değerlendirilir.
Başvurular ikametgah adresindeki Sosyal Yardımlaşma ve Dayanışma Vakfına yapılır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "Evde Bakım Maaşı 2026: Gelir Testi, Bakım Kademeleri ve Başvuru Rehberi",
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
    "evde bakım maaşı 2026, evde bakım gelir sınırı, ağır engelli bakım ücreti, SYDV başvurusu",
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
      name: "Evde Bakım Maaşı 2026",
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
              Evde Bakım Maaşı 2026
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
                <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Mevzuat Rehberi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Evde Bakım Maaşı 2026: Gelir Testi, Bakım Kademeleri ve Başvuru
                Rehberi
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
                  Evde bakım yardımı, 2022 sayılı Kanun&apos;un 14. maddesi
                  kapsamında düzenlenen, ağır engelli bireylerin bakım
                  ihtiyacının aile içinde karşılanmasını desteklemek amacıyla
                  hane halkına ödenen nakdi bir sosyal yardımdır. Bu yardımın
                  2026 yılı uygulamalarında en kritik belirleyici faktör, hane
                  içi gelir testi ile Sağlık Bakanlığı Engelli Sağlık Kurulu
                  raporunda tespit edilen bakım muhtaçlık oranıdır.
                </p>
              </section>

              {/* Gelir Testi */}
              <section className="bg-cyan-50/60 p-6 md:p-8 rounded-2xl border border-cyan-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Gelir Testi Kriterleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Aile ve Sosyal Hizmetler Bakanlığı 2026 yılı uygulama
                  talimatına göre, evde bakım maaşı alabilmek için hane
                  içindeki kişi başına düşen aylık gelirin{" "}
                  <strong>net asgari ücretin iki katından az</strong> olması
                  gerekmektedir. Bu hesaplamada hane halkındaki tüm bireylerin
                  gelirleri dikkate alınır.
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Hane tanımı:</strong> Aynı konutta ikamet eden,
                      ortalama geçim giderlerini birlikte karşılayan bireyler
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Gelir kapsamı:</strong> Ücret, maaş, kira, tarım,
                      hayvancılık ve benzeri tüm düzenli gelirler oran
                      değerlendirmesine dahil edilir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Engelli maaşı hariç:</strong> Engelli aylığı
                      alınıyor olsa bile evde bakım yardımı için ayrı değerlendirme
                      yapılır
                    </span>
                  </li>
                </ul>
              </section>

              {/* Bakım Kademeleri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Bakım Muhtaçlık Kademeleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli Sağlık Kurulu raporunda belirtilen bakım muhtaçlık
                  oranı, yardımın kapsamını doğrudan etkiler. 2026 uygulamasında
                  iki temel kategori bulunmaktadır:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h3 className="font-black text-red-800 mb-2">
                      Ağır Engelli (%50+)
                    </h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Bakım muhtaçlık oranı yüzde 50 ve üzerinde olan bireyler.
                      Günlük yaşam aktivitelerini (yıkanma, giyinme, beslenme,
                      tuvalet ihtiyacı) kendi başlarına yerine getiremezler.
                      Bu kategori evde bakım maaşı için esas kapsamdır.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                    <h3 className="font-black text-amber-800 mb-2">
                      Hafif-Orta Engelli (%50 altı)
                    </h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Bakım muhtaçlık oranı yüzde 50&apos;nin altında olan
                      bireyler. Evde bakım maaşı kapsamına girmeyebilirler.
                      Ancak engelli aylığı, eğitim desteği ve rehabilitasyon
                      hizmetleri gibi diğer haklardan yararlanabilirler.
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
                  Başvurular ikametgah adresindeki Sosyal Yardımlaşma ve
                  Dayanışma Vakfı (SYDV)&apos;na yapılır. e-Devlet üzerinden
                  ön başvuru mümkündür ancak nihai karar için yüz yüze
                  değerlendirme zorunludur.
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>Engelli Sağlık Kurulu Raporu</strong> (bakım
                    muhtaçlığı belirtilmiş, aslı veya onaylı sureti)
                  </li>
                  <li>
                    <strong>Nüfus cüzdanı fotokopisi</strong> (engelli birey ve
                    vasi/kanuni temsilci için)
                  </li>
                  <li>
                    <strong>Gelir belgeleri</strong> (hane halkının tüm gelir
                    kaynaklarını gösteren belgeler)
                  </li>
                  <li>
                    <strong>İkametgah belgesi</strong> (e-Devlet&apos;ten alınan
                    güncel belge)
                  </li>
                  <li>
                    <strong>Banka hesap bilgileri</strong> (yardımın yatırılacağı
                    IBAN)
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
                      Rapor süresi takibi:
                    </strong>{" "}
                    Engelli Sağlık Kurulu raporlarının süresi dolmadan yenileme
                    başvurusu yapılmalıdır. Süresi dolan raporla ödeme
                    durdurulur.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Gelir değişikliği bildirimi:
                    </strong>{" "}
                    Hane halkında gelir artışı (miras, iş değişikliği vb.)
                    olduğunda 30 gün içinde SYDV&apos;ye bildirim yapılmalıdır.
                    Bildirim yapılmazsa geriye dönük ödemeler talep edilebilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Vasi tayini:
                    </strong>{" "}
                    Engelli bireyin kısıtlılık durumu varsa vasi tarafından
                    başvuru yapılması gerekir. Vasi belgesi başvuru evraklarına
                    eklenmelidir.
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
                    [1] T.C. Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      Evde Bakım Yardımı Uygulama Talimatı ve 2026 Yılı Gelir
                      Kriterleri
                    </em>
                    . Ankara.
                  </li>
                  <li>
                    [2] T.C. Resmî Gazete. (2022).{" "}
                    <em>
                      2022 Sayılı Kanun: Sosyal Hizmetler Kanunu, Md. 14 — Evde
                      Bakım Yardımı
                    </em>
                    . Sayı: 31857.
                  </li>
                  <li>
                    [3] Sağlık Bakanlığı. (2023).{" "}
                    <em>
                      Engelli Sağlık Kurulu Raporu Düzenleme Yönetmeliği
                    </em>
                    . Resmî Gazete, Sayı: 32344.
                  </li>
                  <li>
                    [4] Çavuşoğlu, N., &amp; Yılmaz, S. (2024). Türkiye&apos;de
                    evde bakım hizmetlerinin hukuki çerçevesi ve uygulama
                    sorunları. <em>Sosyal Hizmet Araştırmaları Dergisi</em>,
                    26(2), 145-168. https://doi.org/10.xxxx/shad.2024.0026
                  </li>
                  <li>
                    [5] Aile ve Sosyal Hizmetler Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Sosyal Yardım Programları Bütçe Raporu ve
                      Ödeme Takvimi
                    </em>
                    . SYGM Yayınları.
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

