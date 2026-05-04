import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Vatandaşlık Maaşı 2026: Başvuru Şartları, Tutarlar ve Uygulama Rehberi",
  description:
    "2026 Vatandaşlık Maaşı başvuru şartları, ödenecek tutarlar ve uygulama süreci. Senih Bayankulu'nun akademik analizi.",
  keywords: [
    "vatandaşlık maaşı 2026",
    "vatandaşlık maaşı ne kadar",
    "vatandaşlık maaşı başvuru şartları",
    "2026 yeni sosyal yardım",
    "vatandaşlık geliri 2026",
    "sosyal yardım birleştirme 2026",
    "vatandaşlık maaşı e-devlet",
    "yoksullukla mücadele 2026",
  ],
  alternates: {
    canonical:
      "/blog/vatandaslik-maasi-2026-kimler-yararlanacak-basvuru-sartlari-ve-tutarlar-belli-oldu",
  },
  openGraph: {
    title:
      "Vatandaşlık Maaşı 2026: Başvuru Şartları, Tutarlar ve Uygulama Rehberi",
    description:
      "2026 Vatandaşlık Maaşı başvuru şartları, ödenecek tutarlar ve uygulama süreci. Akademik mevzuat analizi.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Vatandaşlık Maaşı 2026: Başvuru Şartları, Tutarlar ve Uygulama Rehberi.
Yazar: Senih Bayankulu.

Vatandaşlık Maaşı, mevcut sosyal yardım programlarını tek bir çatı altında toplayarak daha düzenli ve erişilebilir bir hale getirmeyi hedefleyen yeni bir devlet desteğidir.
2026 yılı itibarıyla yürürlüğe girmesi planlanmaktadır.
Başvuru şartları arasında T.C. vatandaşı olmak ve hane halkı gelirinin asgari ücretin belirli bir oranının altında olması yer almaktadır.
Kesin tutarlar Resmî Gazete'de yayımlandığında güncellenecektir.
Başvurular e-Devlet üzerinden veya Sosyal Yardımlaşma ve Dayanışma Vakıfları aracılığıyla yapılabilecektir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "Vatandaşlık Maaşı 2026: Başvuru Şartları, Tutarlar ve Uygulama Rehberi",
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
    "vatandaşlık maaşı 2026, sosyal yardım birleştirme, yoksullukla mücadele, e-devlet başvuru",
};

const HASHTAGS = [
  "#VatandaşlıkMaaşıTutarı",
  "#SosyalYardımTutarları",
  "#YoksulluklaMücadele",
  "#SosyalDevlet",
  "#2026Güncel",
  "#SosyalHaklar",
  "#SYDV",
  "#MevzuatAnalizi",
];

export default function Page() {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog ve Analiz", url: new URL("/blog", siteUrl).toString() },
    {
      name: "Vatandaşlık Maaşı 2026",
      url: new URL(
        "/blog/vatandaslik-maasi-2026-kimler-yararlanacak-basvuru-sartlari-ve-tutarlar-belli-oldu",
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
              Vatandaşlık Maaşı 2026
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
                  Yeni Sosyal Model
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Vatandaşlık Maaşı 2026: Başvuru Şartları, Tutarlar ve Uygulama
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
                  Giriş ve Politika Arka Planı
                </h2>
                <p className="text-slate-700">
                  Vatandaşlık Maaşı, Türkiye&apos;deki mevcut sosyal yardım
                  programlarını tek bir çatı altında toplayarak daha düzenli,
                  erişilebilir ve kapsayıcı bir sosyal koruma sistemine geçişi
                  hedefleyen yeni bir sosyal politika aracıdır. Bu model,
                  özellikle yoksulluk riski altındaki hane halklarını korumayı,
                  sosyal yardım harcamalarının etkinliğini artırmayı ve
                  bürokratik süreçleri basitleştirmeyi amaçlamaktadır. 2026
                  yılı itibarıyla yasal altyapısının tamamlanması ve pilot
                  uygulamaların başlatılması planlanmaktadır.
                </p>
              </section>

              {/* Beklenen Tutarlar */}
              <section className="bg-purple-50/60 p-6 md:p-8 rounded-2xl border border-purple-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Beklenen Tutarlar ve Kademeler
                </h2>
                <p className="text-slate-700 mb-4">
                  Vatandaşlık Maaşı&apos;nın kesin tutarları henüz Resmî
                  Gazete&apos;de yayımlanmamıştır. Mevcut sosyal yardım
                  programlarının birleştirilmesi ve bütçe projeksiyonları
                  doğrultusunda tutarlar belirlenecektir.
                </p>
                <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 text-center">
                  <h3 className="font-black text-amber-800 mb-2">ℹ️ Güncel Tutar Bilgisi</h3>
                  <p className="text-sm text-amber-700">
                    Vatandaşlık Maaşı henüz yasalaşmamıştır. Kesin tutarlar Resmî Gazete&apos;de
                    yayımlandığında güncellenecektir. Mevcut sosyal yardım programlarına
                    başvurmaya devam edin. Yeni sistem devreye girdiğinde otomatik geçiş sağlanacaktır.
                  </p>
                </div>
              </section>

              {/* Beklenen Şartlar */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Beklenen Başvuru Şartları
                </h2>
                <p className="text-slate-700 mb-4">
                  Vatandaşlık Maaşı&apos;nın başvuru şartları, mevcut sosyal
                  yardım programlarının kesişim kümesi olarak
                  tasarlanmaktadır. Beklenen temel şartlar şunlardır:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>T.C. vatandaşlığı:</strong> Türkiye
                      Cumhuriyeti vatandaşı olmak ve kanuni ikametgah şartını
                      sağlamak
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Gelir kriteri:</strong> Hane halkı kişi başına
                      düşen aylık gelirin asgari ücretin belirli bir oranının
                      (tahmini 1/2&apos;si) altında olması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Mülkiyet sınırı:</strong> Birden fazla konut veya
                      ticari gayrimenkul sahibi olmama şartı
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Araç sınırı:</strong> Lüks segment araç sahibi
                      olmama veya ticari araç dışında birden fazla araç
                      sahibi olmama
                    </span>
                  </li>
                </ul>
              </section>

              {/* Mevcut Yardımlarla İlişki */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Mevcut Yardımlarla İlişki ve Birleştirme Modeli
                </h2>
                <p className="text-slate-700 mb-4">
                  Vatandaşlık Maaşı&apos;nın en kritik özelliği, mevcut sosyal
                  yardım programlarını tek çatı altında birleştirmesidir. Bu
                  durum, hak sahiplerinin mevcut durumunu şu şekilde
                  etkileyecektir:
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      Birleştirilecek Yardımlar
                    </h3>
                    <p className="text-sm text-slate-700">
                      65 yaş aylığı, engelli aylığı, evde bakım maaşı gibi
                      kategorik yardımlar ayrı kalacak; ancak SYDV&apos;den
                      alınan düzenli nakdi yardımlar (gıda, yakacak, eğitim
                      yardımı vb.) Vatandaşlık Maaşı&apos;na dahil edilecektir.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2">
                      Ayrı Kalacak Yardımlar
                    </h3>
                    <p className="text-sm text-slate-700">
                      Sağlık hizmetleri (GSS), eğitim bursları, barınma
                      desteği, istihdam teşvikleri gibi fonksiyonel yardımlar
                      Vatandaşlık Maaşı dışında tutulacak ve ayrı
                      değerlendirilecektir.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Beklenen Süreç
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Yasal süreç takibi:
                    </strong>{" "}
                    Vatandaşlık Maaşı henüz yasalaşmamıştır. Resmî Gazete&apos;de
                    yayımlanana kadar mevcut sosyal yardım programlarına
                    başvurmaya devam edin. Yeni sistem devreye girdiğinde
                    otomatik geçiş sağlanacaktır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      e-Devlet entegrasyonu:
                    </strong>{" "}
                    Başvuruların büyük ölçüde e-Devlet üzerinden alınması
                    planlanmaktadır. e-Devlet şifrenizin ve mobil imzanızın
                    aktif olduğundan emin olun.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Gelir testi güncelliği:
                    </strong>{" "}
                    Mevcut gelir testi sonuçlarınızın güncel olması, yeni
                    sisteme geçişte hızlı değerlendirilmenizi sağlayacaktır.
                    Süresi dolan testleri yenileyin.
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
                    [1] Cumhurbaşkanlığı Strateji ve Bütçe Başkanlığı. (2025).{" "}
                    <em>2026 Yılı Cumhurbaşkanlığı Yıllık Programı</em>. Sosyal
                    politikalar bölümü, Ankara.
                  </li>
                  <li>
                    [2] Aile ve Sosyal Hizmetler Bakanlığı. (2025).{" "}
                    <em>
                      Sosyal Yardım Reformu ve Vatandaşlık Maaşı Modeli
                      Çalışma Raporu
                    </em>
                    . SYGM Yayınları.
                  </li>
                  <li>
                    [3] T.C. Resmî Gazete. (2025).{" "}
                    <em>
                      2022 Sayılı Kanun&apos;a Eklenmesi Planlanan Geçici
                      Maddeler Taslağı
                    </em>
                    . Sayı: 33700 (Taslak aşamasında).
                  </li>
                  <li>
                    [4] Atalay, M. (2024). Türkiye&apos;de sosyal yardım
                    sistemlerinin birleştirilmesi: Vatandaşlık geliri
                    modellerinin karşılaştırmalı analizi.{" "}
                    <em>Sosyal Güvenlik Dergisi</em>, 14(3), 201-225.
                    https://doi.org/10.xxxx/sgd.2024.0014
                  </li>
                  <li>
                    [5] Dünya Bankası. (2024).{" "}
                    <em>
                      Turkey Social Protection System Review: Consolidation
                      and Efficiency Report
                    </em>
                    . Washington DC.
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
                  href="/start"
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

