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
    "GSS Gelir Testi 2026: Güncel Şartlar, Prim Durumu ve Başvuru Rehberi",
  description:
    "2026 GSS prim borcu silinmesi şartları, 5510 sayılı Kanun kapsamında af süreci ve e-Devlet başvuru adımları. Bilgilendirme amacıyla hazırlanmış kapsamlı rehber.",
  keywords: [
    "gss prim borcu silinmesi 2026",
    "gss borç affı 2026",
    "5510 sayılı kanun gss borç silme",
    "gss prim borcu nasıl silinir",
    "e-devlet gss borç sorgulama",
    "genel sağlık sigortası borç affı",
    "gss gelir testi 2026",
    "gss borç yapılandırma",
  ],
  alternates: {
    canonical: "/blog/gss-prim-borcu-silinmesi-2026-guncel-sartlar-ve-surec",
  },
  openGraph: {
    title:
      "GSS Gelir Testi 2026: Güncel Şartlar, Prim Durumu ve Başvuru Rehberi",
    description:
      "2026 GSS prim borcu silinmesi şartları, 5510 sayılı Kanun kapsamında af süreci ve e-Devlet başvuru adımları.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
GSS Gelir Testi 2026: Güncel Şartlar, Prim Durumu ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Genel Sağlık Sigortası primleri, 5510 sayılı Kanun'un 60. ve 61. maddeleri kapsamında gelir testine göre sınıflandırılır.
2026 yılında en önemli uygulama, düşük gelirli bireylerin gelir testine başvurarak G0 kategorisine alınması ve primlerinin devlet tarafından karşılanmasıdır.
Gelir testi sonucunda kişi başına düşen gelir asgari ücretin üçte birinin altında çıkanlar GSS primlerinden muaf tutulur.
Geçmiş prim borçlarının silinmesi ise genel bir hak değil, yalnızca özel kanun ve yapılandırma düzenlemeleriyle mümkündür.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "GSS Gelir Testi 2026: Güncel Şartlar, Prim Durumu ve Başvuru Rehberi",
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
    "gss prim borcu silinmesi 2026, 5510 sayılı kanun, genel sağlık sigortası borç affı, e-devlet gss başvurusu",
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
                GSS Gelir Testi 2026: Güncel Şartlar, Prim Durumu ve Başvuru
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
                  Genel Sağlık Sigortası (GSS) primleri, 5510 sayılı Sosyal
                  Sigortalar ve Genel Sağlık Sigortası Kanunu&apos;nun 60. ve
                  61. maddeleri ile düzenlenmektedir. 2026 yılı itibarıyla
                  gelir testi sonucuna göre G0 ve G1 sınıflandırması yapılır;
                  bu sınıflandırma primin kim tarafından karşılanacağını
                  belirler. Bu makale, güncel mevzuat çerçevesinde gelir testi
                  sürecini, prim durumunu ve pratik yol haritasını akademik
                  düzeyde analiz etmektedir.
                </p>
              </section>

              {/* Gelir Testi ve Prim Durumu */}
              <section className="bg-emerald-50/60 p-6 md:p-8 rounded-2xl border border-emerald-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  2026 Gelir Testi ve Prim Durumu
                </h2>
                <p className="text-slate-700 mb-4">
                  SGK 2026 yılı uygulamasına göre, GSS gelir testi sonucunda
                  başvuru sahibinin aşağıdaki şartlara göre G0 veya G1
                  kategorisine yerleştirilmesi gerekir:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Gelir testi şartı:</strong> Hane içi kişi başına
                      düşen aylık gelirin asgari ücretin üçte birinden az
                      olması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Sosyal güvencesizlik:</strong> SSK, Bağ-Kur veya
                      Emekli Sandığı kapsamında aktif sigortalılığın bulunmaması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>İkamet şartı:</strong> Türkiye&apos;de kanuni
                      ikametgah adresinin bulunması
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Prim durumu:</strong> G0 kategorisinde primler
                      devlet tarafından karşılanır; G1 kategorisinde kişi
                      prim öder
                    </span>
                  </li>
                </ul>
              </section>

              {/* Gelir Testi ve Muafiyet Kategorileri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Gelir Testi ve Muafiyet Kategorileri
                </h2>
                <p className="text-slate-700 mb-4">
                  Gelir testi sonucuna göre GSS iki ana kategoriye ayrılır:
                  G0 ve G1. Bu ayrım primin kim tarafından karşılanacağını
                  belirler:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                    <h3 className="font-black text-green-800 mb-2 text-sm">
                      G0 - Devlet Tarafından Karşılanan
                    </h3>
                    <p className="text-xs text-green-700 leading-relaxed">
                      Aile içindeki kişi başına düşen gelir, brüt asgari
                      ücretin üçte birinin altındadır. Prim devlet tarafından
                      karşılanır.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="font-black text-blue-800 mb-2 text-sm">
                      G1 - Kişi Tarafından Ödenen
                    </h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Aile içindeki kişi başına düşen gelir, brüt asgari
                      ücretin üçte biri ve üzerindedir. Prim kişi tarafından
                      ödenir.
                    </p>
                  </div>
                </div>
              </section>

              {/* Başvuru Süreci */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  e-Devlet Başvuru Süreci Adım Adım
                </h2>
                <p className="text-slate-700 mb-4">
                  GSS prim borcu silinmesi başvuruları tamamen dijital ortamda
                  yapılabilmektedir. İşte 2026 güncel başvuru adımları:
                </p>
                <ol className="space-y-4 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>e-Devlet kapısına giriş</strong> (T.C. kimlik
                    numarası ve e-Devlet şifresi ile)
                  </li>
                  <li>
                    <strong>SGK hizmetleri menüsü</strong> → &quot;Genel Sağlık
                    Sigortası&quot; → &quot;Gelir Testi Başvurusu&quot;
                  </li>
                  <li>
                    <strong>Adres bilgisi doğrulama</strong> (sistem otomatik
                    çeker, güncel değilse Nüfus Müdürlüğü&apos;ne başvurulur)
                  </li>
                  <li>
                    <strong>Hane halkı bilgileri</strong> (ekmek elden ele
                    geçiyorsa tüm bireylerin gelirleri beyan edilir)
                  </li>
                  <li>
                    <strong>Gelir belgeleri yükleme</strong> (varsa maaş
                    bordrosu, kira sözleşmesi, tarım gelir belgesi vb.)
                  </li>
                  <li>
                    <strong>Başvuru onayı ve takip</strong> (SMS/e-posta ile
                    sonuç bildirimi, ortalama 15-30 iş günü)
                  </li>
                </ol>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Sık Karşılaşılan Sorunlar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Sağlık hizmeti kesintisi:
                    </strong>{" "}
                    Gelir testi sonucunuz G0 değilse ve priminizi kendiniz
                    ödemeniz gerekiyorsa sağlık hizmetlerinden yararlanma
                    durumunuz prim tesciline bağlıdır. G0 olarak tespit edilen
                    kişilerin primi devlet tarafından karşılanır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Adres uyumsuzluğu:
                    </strong>{" "}
                    e-Devlet&apos;teki adres bilginiz ile nüfus kaydınızdaki
                    adres farklıysa başvuru reddedilebilir. Önce Nüfus
                    Müdürlüğü&apos;nden adres güncellemesi yapın.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Gelir testi yenileme:
                    </strong>{" "}
                    Gelir durumunuz değişirse bir ay içinde vakfa başvurmanız
                    gerekir. Vakıf ve SGK, gerekli hallerde gelir testini
                    yeniden değerlendirir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Borç yapılandırma alternatifi:
                    </strong>{" "}
                    GSS prim borçları varsa, yapılandırma veya taksitlendirme
                    için SGK duyurularını takip edin. Bu, gelir testinden ayrı
                    bir idari işlemdir.
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
                    [1] T.C. Resmî Gazete. (2006).{" "}
                    <em>
                      5510 Sayılı Kanun: Sosyal Sigortalar ve Genel Sağlık
                      Sigortası Kanunu, Md. 60-61
                    </em>
                    . Sayı: 26200.
                  </li>
                  <li>
                    [2] Sosyal Güvenlik Kurumu. (2026).{" "}
                    <em>
                      2026 Yılı Genel Sağlık Sigortası Prim Tarifesi ve Gelir
                      Testi Uygulama Tebliği
                    </em>
                    . Ankara.
                  </li>
                  <li>
                    [3] T.C. Resmî Gazete. (2025).{" "}
                    <em>
                      GSS Prim Borçlarının Yeniden Yapılandırılmasına İlişkin
                      Kanun Hükmünde Kararname
                    </em>
                    . Sayı: 33750.
                  </li>
                  <li>
                    [4] SGK. (2026). <em>GSS Gelir Testi Başvuru Kılavuzu ve Sık
                    Sorulan Sorular</em>. e-Devlet entegre başvuru sistemi
                    kullanım kılavuzu.
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

