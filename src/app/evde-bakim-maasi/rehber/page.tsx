import type { Metadata } from "next";
import Link from "next/link";
import { homeCareApplicationGuide } from "@/lib/home-care-application-guide";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı rehberi | D-SHR",
  description:
    "Evde bakım maaşı için başvuru öncesi kısa rehber ve hazırlık adımlarını özetleyen sayfa.",
  alternates: {
    canonical: "/evde-bakim-maasi/rehber",
  },
};

export default function HomeCareRehberPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="card-panel">
          <p className="eyebrow">Evde Bakım Rehberi</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {homeCareApplicationGuide.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Bu sayfa evde bakım maaşı akışı için kısa bir okuma noktası sunar. Başvuru
            hazırlığından önce hangi bilgileri kontrol etmeniz gerektiğini sade ve kurumsal
            bir dille özetler.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/evde-bakim-maasi" className="primary-link">
              Ana rehbere git
            </Link>
            <Link href="/evde-bakim-maasi/basvuru-rehberi" className="secondary-link">
              Başvuru hazırlık rehberi
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {homeCareApplicationGuide.steps.map((step) => (
            <article key={step.title} className="card-panel">
              <h2 className="text-2xl font-semibold text-slate-950">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Nereden devam etmeli?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Bu kısa rehberden sonra başvuru hazırlık sayfasına geçebilir veya ön değerlendirme
            akışını yeniden açabilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/evde-bakim-maasi/basvuru-rehberi" className="secondary-link inline-flex">
              Başvuru hazırlık sayfası
            </Link>
            <Link href="/evde-bakim-maasi/hesaplama" className="secondary-link inline-flex">
              Ön değerlendirmeyi aç
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
