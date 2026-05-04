import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  homepageChooseItems,
  homepageGuideLinks,
  homepageHero,
  homepageTrustNotes,
} from "@/lib/homepage-entry-content";
import { buildFaqJsonLd } from "@/lib/seo-json";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Dijital Sosyal Hak Rehberi",
  description:
    "Sosyal hak testleri, rehberler ve sonraki adım yönlendirmeleri için sade, güven veren ve editoryal bir başlangıç sayfası.",
  alternates: {
    canonical: "/",
  },
};

const heroStats = [
  {
    label: "Odak",
    value: "Net başlangıç",
    detail: "Soru, sonuç ve sonraki adım tek bir akışta ilerler.",
  },
  {
    label: "Dil",
    value: "Anlaşılır",
    detail: "Karmaşık başlıkları günlük dile indirir.",
  },
  {
    label: "Güven",
    value: "Sakin",
    detail: "Yalnızca gerekli bilgiler alınır.",
  },
];

const liveExperienceCards = [
  {
    badge: "Kısa akış",
    title: "Sorular ilerledikçe özet görünür",
    body: "Kısa sorular ilerledikçe sonuç anlaşılır bir özet halinde gösterilir.",
  },
  {
    badge: "Sade sonuç",
    title: "İlgili testlere doğrudan geçiş",
    body: "Evde bakım, GSS, 65 yaş aylığı ve doğum yardımı için doğrudan girişler sunulur.",
  },
  {
    badge: "Veri koruma",
    title: "Yalnızca gerekli bilgi istenir",
    body: "Kimlik numarası, açık adres ve belge yükleme istemeden yalnızca gerekli bilgiler alınır.",
  },
];

const servicePillars = [
  {
    title: "Engelli hakları rehberliği",
    body:
      "Haklara erişimi sadeleştiren, mevzuat temelli ve açıklamalı yönlendirme yaklaşımı.",
  },
  {
    title: "Sosyal yardım başvuru desteği",
    body:
      "Başvuru adımlarını anlaşılır hale getirir, eksik bilgiyi önceden görünür kılar.",
  },
  {
    title: "Mevzuat ve yöntem şeffaflığı",
    body:
      "Sonuçların sınırlarını, dayanaklarını ve rehber niteliğini açıkça anlatır.",
  },
];

const faqItems = [
  {
    question: "Bu site resmî karar verir mi?",
    answer:
      "Hayır. Site ön değerlendirme ve rehberlik sunar; resmî karar ilgili kurumlar tarafından verilir.",
  },
  {
    question: "Hangi testten başlamalıyım?",
    answer:
      "İhtiyacınıza en yakın başlıktan başlayabilirsiniz. Evde bakım, GSS, 65 yaş aylığı ve doğum yardımı için ayrı girişler vardır.",
  },
  {
    question: "Neden bazı sayfalarda kısa rehberler var?",
    answer:
      "Amaç, kullanıcıyı teknik detayla yormadan sonraki adımı netleştirmek ve başvuruya hazırlamaktır.",
  },
  {
    question: "Kişisel verilerim neden istenmiyor?",
    answer:
      "Ön değerlendirme aşamasında yalnızca gerekli alanlar kullanılır; gereksiz veri toplamamak temel ilkedir.",
  },
];

const homeFaqJsonLd = buildFaqJsonLd(faqItems);

const whatsappChannel = siteProfile.contactChannels.find((channel) => channel.kind === "whatsapp");

export default function Home() {
  return (
    <main className="min-h-screen pb-12">
      <section className="hero-shell">
        <div className="hero-grid">
          <article className="hero-copy">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 rounded-full border border-[rgba(27,40,50,0.10)] bg-white/70 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(27,40,50,0.12)] bg-white">
                  <Image
                    src="/d-shr-logo.svg"
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="hero-kicker">{homepageHero.eyebrow}</p>
                  <p className="text-sm text-slate-600">Sosyal Hak Rehberi</p>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="hero-title max-w-3xl text-[clamp(2.9rem,5vw,5.8rem)] text-slate-950">
                  {homepageHero.title}
                </h1>
                <p className="hero-lead max-w-2xl">
                  {homepageHero.body} {siteProfile.mission}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/start" className="primary-link">
                  {homepageHero.primaryCtaLabel}
                </Link>
                <Link href="/hakkimizda" className="secondary-link">
                  Rehberin vizyonunu gör
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="status-pill">Sade akış</span>
                <span className="status-pill">Güvenli yönlendirme</span>
                <span className="status-pill">Resmî karar vermez</span>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <article key={stat.label} className="hero-note">
                  <p className="hero-note-title">{stat.label}</p>
                  <p className="hero-note-body mt-2 font-semibold">{stat.value}</p>
                  <p className="hero-note-body">{stat.detail}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="hero-aside">
            <div className="panel-soft">
              <span className="status-pill">Bugün nereden başlayayım?</span>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                En sık kullanılan girişleri burada topladık. İhtiyacınıza en yakın karttan başlayıp
                gereksiz veri toplamadan ilgili rehbere geçebilirsiniz.
              </p>
              <div className="mt-5 space-y-3">
                {homepageChooseItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block rounded-2xl border border-[rgba(27,40,50,0.08)] bg-white/80 px-4 py-4 transition hover:border-[rgba(15,118,110,0.22)] hover:shadow-[0_10px_25px_rgba(15,118,110,0.10)]"
                  >
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel mt-4">
              <p className="section-label">Güven çerçevesi</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {homepageTrustNotes.map((note) => (
                  <p key={note} className="rounded-2xl bg-white/70 px-4 py-3">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="canli-rehberlik" className="section-shell">
        <div className="panel-strong">
          <div className="section-header">
            <div>
              <p className="section-label">Canlı rehber</p>
              <h2 className="section-heading mt-3">Sade açıklama ve net yönlendirme aynı yerde</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Kullanıcı önce kısa bir akışla ilerler, sonra açıklamalı sonucu görür ve gerekirse
              ilgili rehbere yönelir. Bu sayfa da aynı mantığı giriş seviyesinde görünür kılar.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {liveExperienceCards.map((card) => (
              <article key={card.title} className="tool-card">
                <p className="status-pill">{card.badge}</p>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/start" className="primary-link">
              Canlı ön değerlendirmeye git
            </Link>
            {whatsappChannel ? (
              <Link href={whatsappChannel.href} className="secondary-link">
                Uzman desteği iste
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section id="durumunu-sec" className="section-shell">
        <div className="panel-strong">
          <div className="section-header">
            <div>
              <p className="section-label">Başlangıç alanları</p>
              <h2 className="section-heading mt-3">En ilgili uygunluk testine tek adımda girin</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Hangi başlık size daha yakınsa oradan başlayın. Her kart sizi doğrudan ilgili test
              veya rehber sayfasına taşır.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {homepageChooseItems.map((item) => (
              <article key={item.title} className="tool-card">
                <p className="status-pill">Hızlı giriş</p>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
                <Link href={item.href} className="secondary-link mt-5 inline-flex">
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="guven-ve-rehberler" className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="panel-strong">
            <p className="section-label">Mevzuat ve şeffaflık</p>
            <h2 className="section-heading mt-3 text-[2rem]">Ne sağlarız, ne sağlamayız?</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              {homepageTrustNotes.map((note) => (
                <p key={note} className="rounded-2xl bg-white/70 px-4 py-3">
                  {note}
                </p>
              ))}
            </div>
          </aside>

          <article className="panel-strong">
            <p className="section-label">Hak bilgilendirme modülleri</p>
              <h2 className="section-heading mt-3 text-[2rem]">
                Testten önce veya sonra açılabilecek temel rehberler
              </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {homepageGuideLinks.map((guide) => (
                <article key={guide.href} className="panel-soft">
                  <h3 className="text-lg font-semibold text-slate-950">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{guide.body}</p>
                  <Link href={guide.href} className="secondary-link mt-4 inline-flex">
                    Rehberi aç
                  </Link>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="proje-bilgisi" className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="panel-strong">
            <p className="section-label">Danışmanlık yaklaşımı</p>
              <h2 className="section-heading mt-3 text-[2rem]">
                Bu site, sosyal hak bilgisini anlaşılır ve güven veren bir deneyime dönüştürür
              </h2>
            <p className="section-copy mt-4">
              {siteProfile.trustPoints[0]} {siteProfile.professionalSummary}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {servicePillars.map((pillar) => (
                <article key={pillar.title} className="panel-soft text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-950">{pillar.title}</p>
                  <p className="mt-2">{pillar.body}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="panel-strong">
            <p className="section-label">Hızlı bağlantılar</p>
            <h2 className="section-heading mt-3 text-[2rem]">Daha fazla bilgi</h2>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/hakkimizda" className="secondary-link">
                Hakkımızda sayfasını aç
              </Link>
              <Link href="/blog" className="secondary-link">
                Blog ve rehberleri gör
              </Link>
              <Link href="/methodology" className="secondary-link">
                Yöntem ve sınırları oku
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="sss" className="section-shell">
        <div className="panel-strong">
          <div className="section-header">
            <div>
              <p className="section-label">Sık sorulan sorular</p>
              <h2 className="section-heading mt-3">Kısa yanıtlarla temel sorular</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Siteyi ilk kez kullanan ziyaretçiler için en sık gelen soruları tek yerde topladık.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.question} className="tool-card">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={homeFaqJsonLd} id="home-faq-jsonld" />
    </main>
  );
}
