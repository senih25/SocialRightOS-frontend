import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { siteOperations } from "@/lib/site-operations";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Hakkımızda | Misyon, Vizyon ve Kurucu Arka Plan",
  description:
    "Sosyal Hak Rehberi'nin misyonu, vizyonu, kurucu arka planı ve çalışma yaklaşımı.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "Hakkımızda", url: new URL("/hakkimizda", siteUrl).toString() },
]);

const principleCards = [
  {
    eyebrow: "Amaç",
    title: "Kullanıcıyı doğru rehbere hızla ulaştırmak",
    body:
      "Sitenin ilk görevi, sosyal hak bilgisini sade bir giriş, anlaşılır bir test ve net bir sonraki adımla sunmaktır.",
  },
  {
    eyebrow: "Yöntem",
    title: "Teknik dili azaltan, açıklamayı öne alan akış",
    body:
      "İçerik önce kısa cevap verir, sonra gerekçeyi açar ve en son kullanıcıyı ilgili rehbere yönlendirir.",
  },
  {
    eyebrow: "Sınır",
    title: "Resmî karar yerine geçmeyen rehberlik",
    body:
      "Sayfa ve testler ön değerlendirme üretir. Nihai sonuçlar ilgili kurumların güncel incelemesiyle belirlenir.",
  },
];

const backgroundCards = [
  {
    title: "Kurucu notu",
    items: [
      siteProfile.founderSummary,
      siteProfile.professionalSummary,
    ],
  },
  {
    title: "Yayın yaklaşımı",
    items: siteProfile.trustPoints,
  },
  {
    title: "Kapsam",
    items: [
      "Sosyal hak uygunluk testleri",
      "Başvuru ve hazırlık rehberleri",
      "Mevzuatın sadeleştirilmiş özeti",
      "Sonraki adım yönlendirmeleri",
    ],
  },
];

const contactCards = [
  ...siteProfile.contactChannels.map((channel) => ({
    label: channel.label,
    value: channel.value,
    note: channel.note,
    href: channel.href,
    external: channel.kind !== "email",
  })),
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <article className="card-panel relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <p className="eyebrow">Hakkımızda</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
              Sosyal hak bilgisini sade, ölçülü ve kullanılabilir bir rehber deneyimine
              dönüştürüyoruz
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              {siteProfile.mission} Site, kullanıcıyı karmaşık mevzuat metinleriyle baş başa
              bırakmadan doğru teste, doğru rehbere ve doğru sonraki adıma yönlendirmek için
              tasarlanmıştır.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/methodology" className="primary-link">
                Yöntem ve sınırları oku
              </Link>
              <Link href="/blog" className="secondary-link">
                Rehber içeriklerini gör
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Odak
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Hızlı yönlendirme, sade açıklama ve güvenli sonraki adım.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Dil
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Teknik terimleri mümkün olduğunca azaltan editoryal ton.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Güven
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Resmî karar sınırını açık tutan, ölçülebilir bir bilgi akışı.
                </p>
              </div>
            </div>
          </article>

          <aside className="card-panel">
            <p className="eyebrow">Kurucu profil</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{siteProfile.founderName}</h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {siteProfile.founderRole}
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700">{siteProfile.founderSummary}</p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Arka plan özeti</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {siteProfile.professionalSummary}
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {principleCards.map((card) => (
            <article key={card.title} className="card-panel">
              <p className="eyebrow">{card.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <article className="card-panel">
            <p className="eyebrow">Çalışma modeli</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              Görünür yüz, değerlendirme ve yayın aynı çizgide çalışır
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {siteOperations.mission} Her içerik, kullanıcıyı bir sonraki mantıklı adıma
              yönlendirecek şekilde planlanır.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {siteOperations.workStreams.map((stream) => (
                <article key={stream.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {stream.title}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{stream.summary}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{stream.output}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="card-panel">
            <p className="eyebrow">Yayın ilkeleri</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              İçerik üretiminde temel kurallar
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteOperations.publishingRules.map((rule) => (
                <li key={rule} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {rule}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {backgroundCards.map((group) => (
            <article key={group.title} className="card-panel">
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {group.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="card-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">İletişim</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                Doğrudan ve kısa iletişim kanalları
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                Detaylı soru, hızlı yönlendirme veya profesyonel bağlantı için uygun kanaldan
                ulaşabilirsiniz.
              </p>
            </div>
            <Link href="/iletisim" className="primary-link">
              İletişim sayfası
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {channel.label}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-950">{channel.value}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{channel.note}</p>
              </a>
            ))}
          </div>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="about-breadcrumb-jsonld" />
      </div>
    </main>
  );
}
