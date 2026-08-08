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
    "GSS 2026: Gelir Testi, Prim Tutarı ve Başvuru Rehberi",
  description:
    "SGK'nın resmî kaynaklarına göre GSS gelir testi, 2026 prim tutarı, başvuru yeri ve primin devlet tarafından karşılanma koşulları.",
  keywords: [
    "gss 2026",
    "gss gelir testi 2026",
    "gss prim tutarı 2026",
    "gss gelir testi başvurusu",
    "genel sağlık sigortası nedir",
    "gss prim devlet tarafından karşılanır mı",
  ],
  alternates: {
    canonical: "/blog/gss-prim-borcu-silinmesi-2026-guncel-sartlar-ve-surec",
  },
  openGraph: {
    title:
      "GSS 2026: Gelir Testi, Prim Tutarı ve Başvuru Rehberi",
    description:
      "SGK'nın resmî kaynaklarına göre GSS gelir testi, 2026 prim tutarı, başvuru yeri ve primin devlet tarafından karşılanma koşulları.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
GSS 2026: Gelir Testi, Prim Tutarı ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Genel Sağlık Sigortası, sosyal güvencesi olmayan vatandaşlar için gelir testine bağlı olarak işler.
SGK'ya göre gelir testi, prim ödeme gücü bulunmadığını beyan eden kişilerin durumunu belirlemek için yapılır.
2026 yılında geliri brüt asgari ücretin üçte birinin üzerinde olanların ödemesi gereken aylık GSS primi 1.981,80 TL'dir.
Gelir testi için başvuru, Adres Kayıt Sistemi'ndeki ikamet adresinin bulunduğu yerdeki Sosyal Yardımlaşma ve Dayanışma Vakfına yapılır.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "GSS 2026: Gelir Testi, Prim Tutarı ve Başvuru Rehberi",
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
    "gss 2026, gelir testi, genel sağlık sigortası prim tutarı, sydv başvuru, sgk",
};

const HASHTAGS = [
  "#GSSBorçSilinmesi",
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
      name: "GSS Gelir Testi 2026",
      url: new URL(
        "/blog/gss-prim-borcu-silinmesi-2026-guncel-sartlar-ve-surec",
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
              GSS Gelir Testi 2026
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
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider">
                  SGK Mevzuatı
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                GSS 2026: Gelir Testi, Prim Tutarı ve Başvuru Rehberi
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
                  Genel Sağlık Sigortası (GSS) primleri, 5510 sayılı Sosyal
                  Sigortalar ve Genel Sağlık Sigortası Kanunu&apos;nun 60. ve
                  61. maddeleri ile düzenlenmektedir. SGK&apos;nın resmî
                  açıklamalarına göre gelir testi, sosyal güvencesi olmayan
                  vatandaşların prim ödeme gücünü belirlemek için yapılır.
                  Gelir testine göre primin devlet tarafından karşılanması
                  veya kişinin aylık prim ödemesi gerekir. Bu makale, güncel
                  mevzuat çerçevesinde gelir testi sürecini ve 2026 prim
                  tutarını özetlemektedir.
                </p>
              </section>

              {/* Gelir Testi ve Prim Durumu */}
              <section className="bg-emerald-50/60 p-6 md:p-8 rounded-2xl border border-emerald-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Gelir Testi ve Prim Durumu
                </h2>
                <p className="text-slate-700 mb-4">
                  SGK&apos;nın resmî açıklamasına göre, gelir testi sonucunda
                  kişi başına düşen aylık gelir brüt asgari ücretin üçte
                  birinin üzerinde ise 2026 yılı GSS primi ödenir. Geliri bu
                  eşikten düşük olan kişiler için ise primin devlet tarafından
                  karşılanması mümkündür:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Gelir testi şartı:</strong> Hane içi kişi başına
                      düşen aylık gelirin asgari ücretin üçte birinin altında
                      olup olmadığının belirlenmesi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Sosyal güvencesizlik:</strong> Herhangi bir
                      kapsamda sosyal güvencenin bulunmaması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>İkamet şartı:</strong> Adres Kayıt Sistemi&apos;nde
                      kayıtlı ikamet adresinin bulunması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>2026 prim tutarı:</strong> Geliri brüt asgari
                      ücretin üçte birinin üzerinde olanlar için aylık
                      1.981,80 TL
                    </span>
                  </li>
                </ul>
              </section>

              {/* Gelir Testi ve Muafiyet Kategorileri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Gelir Testi Sonuçlarına Göre Uygulama
                </h2>
                <p className="text-slate-700 mb-4">
                  SGK sonuçlarına göre gelir testi iki pratik sonuç üretir:
                  primin devlet tarafından karşılanması veya aylık GSS
                  priminin kişi tarafından ödenmesi:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                    <h3 className="font-black text-green-800 mb-2 text-sm">
                      Devlet Tarafından Karşılanan
                    </h3>
                    <p className="text-xs text-green-700 leading-relaxed">
                      Kişi başına düşen gelir brüt asgari ücretin üçte birinin
                      altındadır. Prim, SGK tescil süreci ve gelir testi
                      sonucuna göre devlet tarafından karşılanabilir.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="font-black text-blue-800 mb-2 text-sm">
                      Kişi Tarafından Ödenen
                    </h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Kişi başına düşen gelir brüt asgari ücretin üçte biri ve
                      üzerindedir. 2026 yılı aylık GSS primi 1.981,80 TL&apos;dir.
                    </p>
                  </div>
                </div>
              </section>

              {/* Başvuru Süreci */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Gelir Testi Başvuru Süreci
                </h2>
                <p className="text-slate-700 mb-4">
                  Gelir testi, SGK&apos;nın resmî açıklamasına göre ikamet
                  adresinin bulunduğu yerdeki Sosyal Yardımlaşma ve
                  Dayanışma Vakfına yapılır. Başvuru sonrası tescil
                  tebligatından itibaren bir ay içinde gelir testine
                  başvurulması halinde primin devlet tarafından karşılanması
                  mümkündür.
                </p>
                <ol className="space-y-4 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>Adres kayıt kontrolü</strong> (ikamet adresinizin
                    güncel olduğundan emin olun)
                  </li>
                  <li>
                    <strong>SYDV başvurusu</strong> (ikamet adresinizin
                    bulunduğu yerdeki Sosyal Yardımlaşma ve Dayanışma
                    Vakfına müracaat)
                  </li>
                  <li>
                    <strong>Tescil tebligatı takibi</strong> (tebligat
                    tarihinden itibaren bir ay içinde gelir testi)
                  </li>
                  <li>
                    <strong>Gelir durumu değişikliği</strong> (değişiklik
                    halinde yeniden başvuru yapılabilir)
                  </li>
                </ol>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik Notlar ve Sınırlar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Borç silinmesi:
                    </strong>{" "}
                    GSS prim borcunun silinmesi genel ve sürekli bir hak
                    değildir; yalnızca özel kanun veya yapılandırma
                    düzenlemeleriyle ortaya çıkabilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Gelir değişikliği:
                    </strong>{" "}
                    Gelir durumu değişenler yeniden gelir testi için SYDV&apos;ye
                    başvurabilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Başvuru süresi:
                    </strong>{" "}
                    Tescil tebligatından sonra bir aylık süre kritik önemdedir;
                    bu süre içinde başvuru yapılırsa devletin prim ödeme
                    yükümlülüğü doğabilir.
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
                    [1] Sosyal Güvenlik Kurumu. (2026).{" "}
                    <em>
                      2026 yılı için genel sağlık sigortası prim tutarı ne kadardır?
                    </em>
                    . SGK resmî bilgi sayfası.
                  </li>
                  <li>
                    [2] Sosyal Güvenlik Kurumu. (2026).{" "}
                    <em>
                      Gelir testi nedir?
                    </em>
                    . SGK resmî bilgi sayfası.
                  </li>
                  <li>
                    [3] Sosyal Güvenlik Kurumu. (2026).{" "}
                    <em>
                      Genel Sağlık Sigortası nedir?
                    </em>
                    . SGK resmî bilgi sayfası.
                  </li>
                  <li>
                    [4] Sosyal Güvenlik Kurumu. (2022).{" "}
                    <em>
                      7326 Sayılı Yapılandırma Kanunu Hakkında Duyuru
                    </em>
                    . SGK duyurusu.
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
                  href="/gss-gelir-testi"
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
