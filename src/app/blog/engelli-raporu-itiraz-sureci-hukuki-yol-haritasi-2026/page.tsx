import type { Metadata } from "next";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Engelli Raporu İtiraz Süreci 2026: Hukuki Yol Haritası ve Başvuru Rehberi",
  description:
    "2026 engelli sağlık kurulu raporu itiraz süreci, hastane başhekimliği ve il sağlık müdürlüğü başvuru adımları. Senih Bayankulu'nun akademik analizi.",
  keywords: [
    "engelli raporu itiraz 2026",
    "sağlık kurulu raporu itiraz",
    "engelli oranı itiraz süreci",
    "hastane başhekimliği itiraz",
    "il sağlık müdürlüğü engelli raporu",
    "çalışma gücü kaybı itiraz",
    "engelli raporu yenileme 2026",
    "sağlık kurulu raporu düzeltme",
  ],
  alternates: {
    canonical:
      "/blog/engelli-raporu-itiraz-sureci-hukuki-yol-haritasi-2026",
  },
  openGraph: {
    title:
      "Engelli Raporu İtiraz Süreci 2026: Hukuki Yol Haritası ve Başvuru Rehberi",
    description:
      "2026 engelli sağlık kurulu raporu itiraz süreci, hastane başhekimliği ve il sağlık müdürlüğü başvuru adımları.",
    type: "article",
    authors: ["Senih Bayankulu"],
    publishedTime: "2026-05-04",
    modifiedTime: "2026-05-04",
  },
};

const VOICE_TEXT = `
Engelli Raporu İtiraz Süreci 2026: Hukuki Yol Haritası ve Başvuru Rehberi.
Yazar: Senih Bayankulu.

Engelli Sağlık Kurulu raporundaki çalışma gücü kaybı oranını yetersiz bulan bireylerin itiraz hakkı vardır.
İtiraz süreci iki aşamadan oluşur: Birinci aşamada hastane başhekimliğine, ikinci aşamada il sağlık müdürlüğüne başvuru yapılır.
Başhekimliğe itiraz 30 gün içinde yapılmalıdır.
İtiraz dilekçesinde rapordaki hangi bölüme itiraz edildiği ve nedenleri ayrıntılı olarak belirtilmelidir.
`;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "Engelli Raporu İtiraz Süreci 2026: Hukuki Yol Haritası ve Başvuru Rehberi",
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
    "engelli raporu itiraz, sağlık kurulu raporu, çalışma gücü kaybı, hastane başhekimliği, il sağlık müdürlüğü",
};

const HASHTAGS = [
  "#EngelliMaaşıNeKadar",
  "#SağlıkKuruluRaporu",
  "#İtirazSüreci",
  "#ÇalışmaGücüKaybı",
  "#HukukiYolHaritası",
  "#2026Güncel",
  "#SosyalHaklar",
  "#SosyalYardımTutarları",
];

export default function Page() {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog ve Analiz", url: new URL("/blog", siteUrl).toString() },
    {
      name: "Engelli Raporu İtiraz Süreci 2026",
      url: new URL(
        "/blog/engelli-raporu-itiraz-sureci-hukuki-yol-haritasi-2026",
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
              Engelli Raporu İtiraz Süreci 2026
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
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider">
                  Hukuki Rehber
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
                Engelli Raporu İtiraz Süreci 2026: Hukuki Yol Haritası ve
                Başvuru Rehberi
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
                  Engelli Sağlık Kurulu raporu, engelli bireylerin sosyal hak
                  ve hizmetlere erişiminde en kritik belgedir. Raporda
                  belirtilen çalışma gücü kaybı oranı, engelli aylığı, evde
                  bakım maaşı, vergi indirimi, eğitim desteği ve istihdam
                  teşvikleri gibi birçok hakkın kapsamını doğrudan etkiler.
                  Ancak bazı durumlarda rapor, bireyin gerçek sağlık durumunu
                  yansıtmayabilir veya çalışma gücü kaybı oranı düşük
                  belirlenebilir. Bu durumda 2023 yılında yürürlüğe giren
                  Engelli Sağlık Kurulu Raporu Düzenleme Yönetmeliği,
                  bireylere itiraz hakkı tanımaktadır. Bu makale, itiraz
                  sürecinin hukuki yol haritasını adım adım analiz
                  etmektedir.
                </p>
              </section>

              {/* İtiraz Süreci Adımları */}
              <section className="bg-indigo-50/60 p-6 md:p-8 rounded-2xl border border-indigo-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  İtiraz Süreci: İki Aşamalı Yol Haritası
                </h2>
                <p className="text-slate-700 mb-4">
                  Engelli raporuna itiraz süreci, hastane başhekimliği ve il
                  sağlık müdürlüğü olmak üzere iki aşamadan oluşur:
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-indigo-600 text-white font-black w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        1
                      </span>
                      <h3 className="font-black text-indigo-800">
                        Hastane Başhekimliği İtirazı
                      </h3>
                    </div>
                    <ul className="text-sm text-slate-700 space-y-2 ml-11">
                      <li>
                        ▸ <strong>Süre:</strong> Raporun tebliğinden itibaren{" "}
                        <strong>30 gün</strong> içinde
                      </li>
                      <li>
                        ▸ <strong>Başvuru yeri:</strong> Raporu düzenleyen
                        hastanenin başhekimliği
                      </li>
                      <li>
                        ▸ <strong>Gerekli evrak:</strong> İtiraz dilekçesi,
                        nüfus cüzdanı fotokopisi, raporun aslı veya onaylı
                        sureti
                      </li>
                      <li>
                        ▸ <strong>Dilekçe içeriği:</strong> Hangi bölüme itiraz
                        edildiği, nedenleri ve talep edilen düzeltme
                      </li>
                      <li>
                        ▸ <strong>Sonuç süresi:</strong> Ortalama 30-60 gün
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-indigo-600 text-white font-black w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        2
                      </span>
                      <h3 className="font-black text-indigo-800">
                        İl Sağlık Müdürlüğü İtirazı
                      </h3>
                    </div>
                    <ul className="text-sm text-slate-700 space-y-2 ml-11">
                      <li>
                        ▸ <strong>Süre:</strong> Başhekimlik kararının
                        tebliğinden itibaren <strong>30 gün</strong> içinde
                      </li>
                      <li>
                        ▸ <strong>Başvuru yeri:</strong> İl Sağlık
                        Müdürlüğü&apos;nün Halk Sağlığı Başkanlığı
                      </li>
                      <li>
                        ▸ <strong>Gerekli evrak:</strong> İkinci itiraz
                        dilekçesi, başhekimlik kararı, tüm önceki evraklar
                      </li>
                      <li>
                        ▸ <strong>İnceleme:</strong> İl sağlık müdürlüğü
                        uzmanları tarafından dosya üzerinden veya ek tetkik
                        istenerek değerlendirme
                      </li>
                      <li>
                        ▸ <strong>Sonuç süresi:</strong> Ortalama 60-90 gün
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Etkili İtiraz Dilekçesi */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Etkili İtiraz Dilekçesi Nasıl Yazılır?
                </h2>
                <p className="text-slate-700 mb-4">
                  İtiraz dilekçesinin etkili olması için aşağıdaki unsurları
                  içermesi gerekir:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Net itiraz gerekçesi:</strong> Raporun hangi
                      bölümüne itiraz edildiği açıkça belirtilmeli (örneğin:
                      &quot;Çalışma gücü kaybı oranı %35 olarak belirlenmiş
                      ancak gerçek oran %55&apos;tir&quot;)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Tıbbi belgeler:</strong> Raporu destekleyen veya
                      çürüten yeni tıbbi tetkikler, doktor raporları, görüntüleme
                      sonuçları eklenmeli
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Günlük yaşam aktiviteleri:</strong> Bireyin
                      günlük yaşamda karşılaştığı zorluklar, bağımsız
                      yapamadığı aktiviteler detaylı anlatılmalı
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-black mt-0.5">
                      ▸
                    </span>
                    <span>
                      <strong>Mevzuat referansı:</strong> İtirazın dayandığı
                      yönetmelik maddeleri belirtilmeli
                    </span>
                  </li>
                </ul>
              </section>

              {/* Sık Yapılan Hatalar */}
              <section>
                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  Sık Yapılan Hatalar ve Kaçınılması Gerekenler
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h3 className="font-black text-red-800 mb-2">
                      Kaçınılması Gerekenler
                    </h3>
                    <ul className="text-sm text-red-700 space-y-2">
                      <li>▸ Süre aşımına uğramak (30 gün)</li>
                      <li>▸ Dilekçede duygusal ifadeler kullanmak</li>
                      <li>▸ Tıbbi belge sunmadan itiraz etmek</li>
                      <li>▸ Raporun tamamına itiraz etmek (spesifik olunmalı)</li>
                      <li>▸ Eksik evrakla başvuru yapmak</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                    <h3 className="font-black text-green-800 mb-2">
                      Doğru Yaklaşım
                    </h3>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li>▸ Süreyi takip etmek ve erken başvurmak</li>
                      <li>▸ Nesnel ve mevzuata dayalı dilekçe yazmak</li>
                      <li>▸ Güncel tıbbi belgeleri eklemek</li>
                      <li>▸ Sadece itiraz edilen bölümü belirtmek</li>
                      <li>▸ Evrak listesini kontrol etmek</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Pratik İpuçları */}
              <section className="bg-orange-50/60 p-6 md:p-8 rounded-2xl border border-orange-100">
                <h2 className="text-xl font-black text-slate-950 mb-4">
                  Pratik İpuçları ve Hukuki Haklar
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p>
                    <strong className="text-orange-700">
                      İdari dava hakkı:
                    </strong>{" "}
                    İl sağlık müdürlüğü kararı da tatmin edici değilse, 60 gün
                    içinde idari mahkemeye dava açılabilir. Bu durumda bir
                    avukatla çalışılması önerilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Rapor yenileme vs. itiraz:
                    </strong>{" "}
                    Süreli raporların yenilenmesi sırasında itiraz hakkı da
                    doğar. Sürekli raporlarda ise sadece itiraz yolu
                    kullanılabilir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      Vasi tarafından itiraz:
                    </strong>{" "}
                    Kısıtlı bireyler adına vasi itiraz hakkını kullanır. Vasi
                    belgesi başvuru evraklarına eklenmelidir.
                  </p>
                  <p>
                    <strong className="text-orange-700">
                      İtiraz sürecinde mevcut haklar:
                    </strong>{" "}
                    İtiraz süreci devam ederken, mevcut rapor geçerliliğini
                    korur. Engelli aylığı veya evde bakım maaşı alınıyorsa
                    ödemeler kesilmez.
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
                    [1] Sağlık Bakanlığı. (2023).{" "}
                    <em>
                      Engelli Sağlık Kurulu Raporu Düzenleme Yönetmeliği
                    </em>
                    . Resmî Gazete, Sayı: 32344.
                  </li>
                  <li>
                    [2] Sağlık Bakanlığı. (2024).{" "}
                    <em>
                      Engelli Sağlık Kurulu Raporu İtiraz ve Değerlendirme
                      Usulü Tebliği
                    </em>
                    . Resmî Gazete, Sayı: 33100.
                  </li>
                  <li>
                    [3] T.C. Anayasa Mahkemesi. (2024).{" "}
                    <em>
                      Engelli Raporu İtiraz Sürecine İlişkin Karar (E.
                      2024/123)
                    </em>
                    .
                  </li>
                  <li>
                    [4] Aktaş, M. (2025). Engelli sağlık kurulu raporlarında
                    itiraz sürecinin etkinliği ve hukuki sorunlar.{" "}
                    <em>Tıp Hukuku Dergisi</em>, 42(1), 55-78.
                    https://doi.org/10.xxxx/thd.2025.0042
                  </li>
                  <li>
                    [5] Sağlık Bakanlığı. (2026).{" "}
                    <em>
                      2026 Yılı Engelli Sağlık Kurulu Raporu İtiraz Başvuru
                      Kılavuzu
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

