import type { Metadata } from "next";
import Link from "next/link";
import { brandProfile } from "@/lib/brand-profile";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: brandProfile.founder.name,
  description: brandProfile.founder.summary,
  alternates: {
    canonical: brandProfile.founder.profilePath,
  },
};

export default function FounderPage() {
  return (
    <main className="page-shell">
      <section className="content-panel">
        <p className="section-label">Kurucu</p>
        <h1 className="section-heading mt-3">{brandProfile.founder.name}</h1>

        <p className="mt-3 text-lg font-medium text-slate-700">
          {brandProfile.founder.role}
        </p>

        <p className="section-copy mt-5 max-w-3xl">
          {brandProfile.founder.summary}
        </p>

        <p className="section-copy mt-4 max-w-3xl">
          Çalışmaları; sosyal hak bilgisini sadeleştirme, dijital kamu
          hizmetlerini daha anlaşılır hale getirme ve kullanıcıların güvenli
          biçimde doğru bilgiye ulaşmasını destekleyen sistemler geliştirme
          odağındadır.
        </p>

        <section className="mt-10">
          <p className="section-label">Çalışma alanları</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {siteProfile.expertise.map((item) => (
              <article key={item} className="content-card">
                <h2 className="text-base font-semibold text-slate-900">{item}</h2>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="section-label">Kamuya açık profiller</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={brandProfile.socialProfiles.personalInstagram}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              Instagram
            </a>
            <a
              href={brandProfile.socialProfiles.professionalInstagram}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              Sosyal hizmet Instagram
            </a>
            <a
              href={brandProfile.socialProfiles.linkedin}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              LinkedIn
            </a>
            <a
              href={brandProfile.socialProfiles.facebook}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              Facebook
            </a>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={brandProfile.organization.profilePath} className="primary-link">
            SocialRightLabs
          </Link>
          <Link href="/iletisim" className="secondary-link">
            İletişim
          </Link>
        </div>
      </section>
    </main>
  );
}
