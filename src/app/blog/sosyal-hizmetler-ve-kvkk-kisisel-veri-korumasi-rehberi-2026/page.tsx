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
    "Sosyal Hizmetler ve KVKK 2026: Özel Nitelikli Veri Koruması Rehberi",
  description:
    "KVKK'nın resmî rehberi ve Kurul kararı temelinde sosyal hizmetlerde özel nitelikli kişisel veri işleme, aydınlatma ve güvenlik yükümlülükleri.",
  keywords: [
    "sosyal hizmetler kvkk 2026",
    "kişisel veri koruma sosyal hizmet",
    "kvkk aydınlatma metni sosyal hizmet",
    "özel nitelikli kişisel veri",
    "sosyal hizmet danışmanlığı gizlilik",
    "kvkk veri güvenliği sosyal yardım",
    "kişisel veri işleme sosyal hizmetler",
    "sosyal hizmetler gizlilik ilkeleri",
  ],
  alternates: {
    canonical:
      "/blog/sosyal-hizmetler-ve-kvkk-kisisel-veri-korumasi-rehberi-2026",
  },
  openGraph: {
    title:
      "Sosyal Hizmetler ve KVKK 2026: Özel Nitelikli Veri Koruması Rehberi",
    description:
      "KVKK'nın resmî rehberi ve Kurul kararı temelinde sosyal hizmetlerde özel nitelikli kişisel veri işleme, aydınlatma ve güvenlik yükümlülükleri.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Sosyal Hizmetler ve KVKK 2026: Özel Nitelikli Veri Koruması Rehberi.
Yazar: Senih Bayankulu.

Sosyal hizmetler alanında veri işleme faaliyetleri, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında düzenlenmektedir.
Özel nitelikli kişisel veriler yalnızca Kanunda sayılan sınırlı işleme şartları ve Kurul tarafından belirlenen yeterli önlemlerle işlenebilir.
Aydınlatma yükümlülüğü ile veri güvenliği tedbirleri, sosyal hizmet kurumları için temel uyum alanlarıdır.
Danışanlar kişisel verilerine erişme, düzeltme ve silme gibi haklarını kullanabilir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Sosyal Hizmetler ve KVKK 2026: Özel Nitelikli Veri Koruması Rehberi",
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
    "KVKK, kişisel veri koruma, sosyal hizmetler, özel nitelikli veri, aydınlatma metni, 6698 sayılı kanun",
};

const HASHTAGS = [
  "#KVKK",
  "#KişiselVeriKoruma",
  "#SosyalHizmetler",
  "#ÖzelNitelikliVeri",
  "#AydınlatmaMetni",
  "#2026Güncel",
  "#SosyalHaklar",
  "#VeriGüvenliği",
];

export default function Page() {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog ve Analiz", url: new URL("/blog", siteUrl).toString() },
    {
      name: "Sosyal Hizmetler ve KVKK 2026",
      url: new URL(
        "/blog/sosyal-hizmetler-ve-kvkk-kisisel-veri-korumasi-rehberi-2026",
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
              Sosyal Hizmetler ve KVKK 2026
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
                <span className="inline-block px-3 py-1 bg-lime-50 text-lime-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Hukuki Rehber
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Sosyal Hizmetler ve KVKK 2026: Özel Nitelikli Veri Koruması Rehberi
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
                  Sosyal hizmetler alanında kişisel veri işleme faaliyetleri,
                  6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                  kapsamında düzenlenmektedir. Sosyal hizmet uzmanları,
                  danışanların sağlık durumu, gelir bilgisi, aile yapısı,
                  psikososyal geçmişi ve diğer özel nitelikli verilerini
                  işlerken kanundaki işleme şartlarına, amaçla sınırlılık
                  ilkesine ve Kurulun belirlediği yeterli önlemlere uymak
                  zorundadır. 2025 tarihli KVKK rehberi, 12.03.2024 tarihli
                  7499 sayılı Kanun değişiklikleri sonrasında özel nitelikli
                  veri işleme şartlarını güncellenmiş şekilde özetlemektedir.
                </p>
              </section>

              {/* KVKK İlkeleri */}
              <section className="bg-lime-50/60 p-6 md:p-8 rounded-2xl border border-lime-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Sosyal Hizmetlerde KVKK Temel İlkeleri
                </h2>
                <p className="text-slate-700 mb-4">
                  Sosyal hizmet uzmanları ve kurumları, kişisel veri işlerken
                  aşağıdaki KVKK ilkelerine uymak zorundadır:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-lime-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Hukuka ve dürüstlük kuralına uygunluk:</strong>{" "}
                      Veriler, kanundaki işleme şartlarından biri olmadan
                      işlenemez
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Doğru ve güncel olma:</strong> Yanlış veya eski
                      veriler güncellenmeli ya da mevzuata uygun şekilde
                      silinmelidir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Amaçla sınırlılık:</strong> Veriler sadece
                      belirlenen sosyal hizmet amacı için kullanılabilir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>İlişkilendirilebilirlik ve sınırlılık:</strong>{" "}
                      Gereksiz veri toplanmamalı, işlemeye ilişkin süreler
                      sınırlı olmalıdır
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime-600 font-black mt-0.5">▸</span>
                    <span>
                      <strong>Güvenlik:</strong> Veriler yetkisiz erişime,
                      kayba veya zarara karşı korunmalıdır
                    </span>
                  </li>
                </ul>
              </section>

              {/* Hassas Veri Kategorileri */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Sosyal Hizmetlerde İşlenen Hassas Veri Kategorileri
                </h2>
                <p className="text-slate-700 mb-4">
                  Sosyal hizmetler alanında işlenen verilerin büyük çoğunluğu
                  KVKK kapsamında &quot;özel nitelikli kişisel veri&quot;
                  kategorisine girer. Bu veriler için yalnızca Kanunda
                  belirtilen işleme şartları ve Kurulun belirlediği yeterli
                  önlemler uygulanabilir:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h3 className="font-black text-red-800 mb-2">
                      Sağlık Verileri
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>▸ Hastalık tanısı ve raporları</li>
                      <li>▸ Engellilik derecesi</li>
                      <li>▸ Psikiyatrik değerlendirme</li>
                      <li>▸ İlaç kullanım bilgisi</li>
                      <li>▸ Tedavi geçmişi</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                    <h3 className="font-black text-amber-800 mb-2">
                      Ekonomik ve Sosyal Veriler
                    </h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>▸ Gelir ve mal varlığı bilgisi</li>
                      <li>▸ Banka hesap bilgileri</li>
                      <li>▸ Aile yapısı ve ilişkileri</li>
                      <li>▸ Adli sicil kaydı</li>
                      <li>▸ Etnik köken ve din bilgisi</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Aydınlatma ve Rıza */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Aydınlatma Metni ve Hukuki İşleme Şartları
                </h2>
                <p className="text-slate-700 mb-4">
                  Sosyal hizmet kurumları, veri işleme öncesinde ilgili kişiyi
                  aydınlatmalı ve özel nitelikli veriler için Kanun&apos;daki
                  sınırlı işleme şartlarından uygun olanına dayanmalıdır. Açık
                  rıza, her durumda tek seçenek değildir; hukuki sebep ve
                  alınan önlemler birlikte değerlendirilir. Aydınlatma metni
                  şunları içermelidir:
                </p>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  <li>
                    <strong>Veri sorumlusu kimliği:</strong> Kurumun adı,
                    adresi ve iletişim bilgileri
                  </li>
                  <li>
                    <strong>İşlenecek verilerin türü:</strong> Hangi
                    kategorilerde veri toplanacağı
                  </li>
                  <li>
                    <strong>Veri işleme amacı:</strong> Sosyal hizmet
                    değerlendirmesi, yardım başvurusu vb.
                  </li>
                  <li>
                    <strong>Veri aktarımı:</strong> Verilerin hangi kurumlara
                    aktarılacağı (SYDV, Aile Bakanlığı, SGK vb.)
                  </li>
                  <li>
                    <strong>Haklar:</strong> Erişim, düzeltme, silme, itiraz
                    haklarının bildirimi
                  </li>
                  <li>
                    <strong>Saklama süresi:</strong> Verilerin ne kadar süreyle
                    tutulacağı ve imha politikası
                  </li>
                </ol>
              </section>

              {/* Danışan Hakları */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Danışanların KVKK Kapsamındaki Hakları
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white p-5 rounded-2xl border-2 border-lime-200">
                    <h3 className="font-black text-lime-800 mb-2">
                      Bilgilendirme Hakları
                    </h3>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li>▸ Veri işleme faaliyetinden haberdar olma</li>
                      <li>▸ Aydınlatma metnini talep etme</li>
                      <li>▸ Veri sorumlusunun kimliğini öğrenme</li>
                      <li>▸ Veri ihlali durumunda bildirim alma</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border-2 border-lime-200">
                    <h3 className="font-black text-lime-800 mb-2">
                      Müdahale Hakları
                    </h3>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li>▸ Kişisel verilerine erişim talep etme</li>
                      <li>▸ Yanlış verilerin düzeltilmesini isteme</li>
                      <li>▸ Verilerin silinmesini talep etme</li>
                      <li>▸ Veri işlemeye itiraz etme</li>
                      <li>▸ Veri taşınabilirliği hakkı</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Dikkat Edilmesi Gerekenler
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      Dijital ortamda veri güvenliği:
                    </strong>{" "}
                    Sosyal hizmet kayıtları dijital ortamda tutuluyorsa, şifreli
                    depolama, erişim logları ve düzenli yedekleme
                    yapılmalıdır. USB belleklerle veri taşınmamalıdır.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Üçüncü kişi bilgisi:
                    </strong>{" "}
                    Danışan hakkında toplanan veriler, hukuki dayanak olmadan
                    üçüncü kişilerle (aile üyeleri dahil) paylaşılamaz. Ancak
                    kanuni bildirim yükümlülüğü doğduğunda yetkili mercilere
                    bildirim yapılabilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Veri ihlali bildirimi:
                    </strong>{" "}
                    Kişisel veri ihlali durumunda, kurum vakit kaybetmeden
                    gerekli bildirim ve önlemleri almalıdır; iç prosedürler
                    gecikmeden işletilmelidir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Sosyal medya paylaşımı:
                    </strong>{" "}
                    Danışanların kimlik bilgileri, fotoğrafları veya durumları
                    sosyal medyada paylaşılamaz. Hatta anonimleştirilmiş
                    vaka örnekleri bile danışanın tanınmasına yol açacak
                    detaylar içermemelidir.
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
                    [1] Kişisel Verileri Koruma Kurumu. (2025).{" "}
                    <em>
                      Özel Nitelikli Kişisel Verilerin İşlenmesine İlişkin Rehber
                    </em>
                    . Resmî rehber.
                  </li>
                  <li>
                    [2] Kişisel Verileri Koruma Kurumu. (2018).{" "}
                    <em>
                      Özel Nitelikli Kişisel Verilerin İşlenmesinde Veri
                      Sorumlularınca Alınması Gereken Yeterli Önlemler
                    </em>
                    . Kurul Kararı 2018/10.
                  </li>
                  <li>
                    [3] Kişisel Verileri Koruma Kurumu. (2025).{" "}
                    <em>
                      Veri Güvenliğine İlişkin Yükümlülükler
                    </em>
                    . Kurum rehberi.
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
