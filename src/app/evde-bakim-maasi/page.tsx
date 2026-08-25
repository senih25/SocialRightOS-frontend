import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı Rehberi",
  description:
    "Evde bakım maaşı için temel şartları, gerekli bilgileri ve ön değerlendirme mantığını sade bir dille açıklayan ana rehber sayfası.",
  alternates: {
    canonical: "/evde-bakim-maasi",
  },
};

const promiseSections = [
  {
    title: "Bu sayfa ne sunar?",
    body:
      "Evde bakım maaşı hakkında genel çerçeveyi açıklar ve ön değerlendirme aracına geçmeden önce hangi bilgilerin önemli olduğunu gösterir.",
  },
  {
    title: "Ne sunmaz?",
    body:
      "Resmî hak kazanımı kararı, kişiye özel hukuki görüş veya kurum yerine geçen bağlayıcı sonuç üretmez.",
  },
  {
    title: "Nasıl çalışır?",
    body:
      "Bu sayfa yalnızca değerlendirme sonucunu, nedenleri ve eksik bilgi başlıklarını açıklar.",
  },
];

const checklist = [
  "Engellilik oranı",
  "Aylık toplam hane geliri",
  "Hanedeki kişi sayısı",
  "Türkiye Cumhuriyeti vatandaşlık durumu",
  "Türkiye'de ikamet bilgisi",
  "Tam bağımlı bakım ihtiyacı bilgisi",
];

const faqItems = [
  {
    question: "Bu araç resmî sonuç verir mi?",
    answer:
      "Hayır. Bu araç yalnızca ön değerlendirme sunar. Nihai karar ilgili kurumun incelemesi ve güncel uygulaması ile verilir.",
  },
  {
    question: "Hangi bilgilerle çalışır?",
    answer:
      "Yalnızca temel değerlendirme alanları kullanılır. Kimlik numarası, açık adres veya belge yükleme istenmez.",
  },
  {
    question: "Karar kuralları bu sayfada mı kuruluyor?",
    answer:
      "Hayır. Uygunluk kuralları, eşik değerler ve sonuç anlamları bu sayfa dışında belirlenir.",
  },
];

const detailGuides = [
  {
    href: "/evde-bakim-maasi/basvuru-rehberi",
    title: "Evde Bakım Maaşı başvuru hazırlık rehberi",
    body:
      "Hangi kuruma hangi hazırlıkla gidileceğini ve hangi belge başlıklarının önceden toparlanabileceğini açıklar.",
  },
  {
    href: "/evde-bakim-maasi/sartlar",
    title: "Evde Bakım Maaşı şartları",
    body:
      "Vatandaşlık, ikamet, gelir ve hane bilgisi gibi temel başlıkları kısa ve anlaşılır biçimde özetler.",
  },
  {
    href: "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
    title: "Gelir ve hane bilgisi rehberi",
    body:
      "Gelir ve kişi sayısı alanlarının neden istendiğini ve sayfanın neden nihai gelir kararı vermediğini açıklar.",
  },
];

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "Evde bakım maaşı", url: new URL("/evde-bakim-maasi", siteUrl).toString() },
]);
const faqJsonLd = buildFaqJsonLd(faqItems);

export default function HomeCareAllowancePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="card-panel">
            <p className="eyebrow">Ana Rehber</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Evde bakım maaşı için anlaşılır açıklama ve güvenli ön değerlendirme akışı
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Evde bakım maaşı, ağır engelli bireyin tam bağımlı bakım ihtiyacına ilişkin belirli
              koşullar altında değerlendirilen bir destek alanıdır. Bu sayfa, başvuru öncesi
              hazırlık yapmanıza yardımcı olmak için sade açıklamalar ve ön değerlendirme aracına
              doğrudan geçiş sunar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
                Evde bakım maaşı hesaplama aracını aç
              </Link>
              <Link href="/" className="secondary-link">
                Ana sayfaya dön
              </Link>
            </div>
          </div>

          <aside className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Güven notu</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Sonuçlar yalnızca ön değerlendirme niteliğindedir. Nihai değerlendirme ilgili kurumun
              incelemesi ve güncel uygulaması ile belirlenir.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Bu aşamada istenmeyen veriler</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Kimlik numarası, açık adres, belge yükleme ve gereksiz kişisel veri bu kapsama
                dâhil değildir.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {promiseSections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">
              Ön değerlendirme aracına geçmeden önce hazırlamanız iyi olur
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {checklist.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">
              Ön değerlendirme sonucundan sonra ne beklersiniz?
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                Sayfa size üç temel sonuç yönünden birini gösterebilir: uygun görünüyor, uygun
                görünmüyor veya daha fazla bilgi gerekli.
              </p>
              <p>
                Sonuç ekranında nedenler, eksik bilgiler ve yönlendirici açıklamalar görünür.
                Böylece hangi bilgiyle ilerlediğinizi açık biçimde anlarsınız.
              </p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">En hızlı geçiş yolu</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Temel bilgileri biliyorsanız doğrudan evde bakım ön değerlendirme aracına
                  geçebilirsiniz.
                </p>
                <Link
                  href="/evde-bakim-maasi/hesaplama"
                  className="secondary-link mt-4 inline-flex"
                >
                  Hesaplama aracını aç
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Sık sorulan kısa sorular</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Detay rehberleri</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {detailGuides.map((guide) => (
              <article key={guide.href} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{guide.body}</p>
                <Link href={guide.href} className="secondary-link mt-4 inline-flex">
                  Rehberi aç
                </Link>
              </article>
            ))}
          </div>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="home-care-breadcrumb-jsonld" />
        <JsonLd data={faqJsonLd} id="home-care-faq-jsonld" />
      </div>
    </main>
  );
}
