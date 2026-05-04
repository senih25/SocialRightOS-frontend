import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Dijital Sosyal Hak Rehberi için doğrudan iletişim kanalları, kısa yönlendirme ve geri dönüş beklentisi.",
  alternates: {
    canonical: "/iletisim",
  },
};

const siteUrl = getSiteUrl();
const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
  { name: "İletişim", url: new URL("/iletisim", siteUrl).toString() },
]);

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">İletişim</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Kısa soru ve yönlendirme için doğrudan kanallar
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Uzun form yerine uygun kanaldan kısa mesaj bırakabilirsiniz. Her kanal farklı amaç
            için daha uygundur; hızlı yönlendirme, iş geçmişi veya detaylı soru için doğru kanalı
            seçmek süreci hızlandırır.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {siteProfile.contactChannels.map((channel) => (
            <a
              key={channel.kind}
              href={channel.href}
              target={channel.kind === "email" ? undefined : "_blank"}
              rel={channel.kind === "email" ? undefined : "noreferrer"}
              className="card-panel transition hover:-translate-y-0.5"
            >
              <p className="eyebrow">{channel.label}</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{channel.value}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{channel.note}</p>
            </a>
          ))}
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Ne zaman hangi kanal?</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Kısa soru</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Hızlı yönlendirme veya mevcut sayfaya dair kısa bir soru için WhatsApp ya da
                Instagram uygundur.
              </p>
            </article>
            <article className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Detaylı açıklama</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Daha kapsamlı bir konu, belge veya danışmanlık başlığı için e-posta daha uygundur.
              </p>
            </article>
            <article className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Profesyonel bağlantı</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Geçmiş, deneyim ve iş odaklı değerlendirme için LinkedIn üzerinden iletişim
                kurulabilir.
              </p>
            </article>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Hızlı bağlantılar</h2>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/hakkimizda" className="secondary-link inline-flex">
              Hakkımızda
            </Link>
            <Link href="/yasal-uyari" className="secondary-link inline-flex">
              Yasal uyarı
            </Link>
            <Link href="/methodology" className="secondary-link inline-flex">
              Yöntem ve sınırlar
            </Link>
          </div>
        </section>

        <JsonLd data={breadcrumbJsonLd} id="contact-breadcrumb-jsonld" />
      </div>
    </main>
  );
}
