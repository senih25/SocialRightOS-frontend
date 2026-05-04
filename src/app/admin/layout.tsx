import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İç Panel | D-SHR",
  description: "İç yönetim, içerik taslağı, onay ve yayın akışı.",
  robots: {
    index: false,
    follow: false,
  },
};

const sections = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/studio", label: "Yayın Stüdyosu" },
  { href: "/admin/content", label: "İçerik Kaydı" },
  { href: "/admin/analytics", label: "Analitik Kaydı" },
  { href: "/admin/approval", label: "Onay Sırası" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="panel-strong">
          <p className="section-label">Internal</p>
          <div className="section-header mt-4">
            <div>
              <h1 className="section-heading text-[clamp(2rem,3vw,3.2rem)]">
                D-SHR İç Panel
              </h1>
              <p className="section-copy mt-3 max-w-3xl">
                İçerik taslağı, sayfa düzeni, yayın onayı ve analitik kaydının toplandığı iç
                yönetim alanı.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <Link key={section.href} href={section.href} className="secondary-link compact-link">
                  {section.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
