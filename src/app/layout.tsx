import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteUrl, isProductionSite } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const allowIndexing = isProductionSite(siteUrl);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dijital Sosyal Hak Rehberi",
    template: "%s | D-SHR",
  },
  description:
    "Sosyal hak testleri ve başvuru rehberleri için güven veren, sade ve açıklayıcı bir başlangıç deneyimi. Resmî karar vermez; yol gösterir.",
  applicationName: "Dijital Sosyal Hak Rehberi",
  keywords: [
    "sosyal hak testi",
    "sosyal yardım uygunluk testi",
    "evde bakım maaşı",
    "evde bakım maaşı hesaplama",
    "gss gelir testi",
    "65 yaş aylığı uygunluk testi",
    "sosyal hak rehberi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dijital Sosyal Hak Rehberi",
    description:
      "Sosyal hak testleri için açıklayıcı, güven veren ve anlaşılır bir rehber deneyimi.",
    type: "website",
    locale: "tr_TR",
    siteName: "Dijital Sosyal Hak Rehberi",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dijital Sosyal Hak Rehberi",
    description:
      "Sosyal hak testleri ve rehberleri için güven odaklı rehber deneyimi.",
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
  },
  icons: {
    icon: "/d-shr-logo.svg",
  },
};

const quickLinks = [
  { href: "/blog", label: "Rehber yazıları" },
  { href: "/hakkimizda", label: "Misyon ve vizyon" },
  { href: "/methodology", label: "Yöntem ve sınırlar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <Link href="/" className="site-brand" aria-label="Dijital Sosyal Hak Rehberi ana sayfa">
                <span className="site-brand-mark">
                  <Image
                    src="/d-shr-logo.svg"
                    alt=""
                    width={34}
                    height={34}
                    aria-hidden="true"
                    priority
                  />
                </span>
                <span>
                  <span className="block text-sm text-slate-900">Dijital Sosyal Hak Rehberi</span>
                  <span className="block text-[0.68rem] font-medium tracking-[0.28em] text-slate-500 uppercase">
                    D-SHR
                  </span>
                </span>
              </Link>

              <nav className="site-nav" aria-label="Ana gezinme">
                {quickLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="site-nav-link">
                    {item.label}
                  </Link>
                ))}
                <Link href="/start" className="site-nav-link">
                  Testi Aç
                </Link>
              </nav>
            </div>
          </header>

          <div className="site-status-banner">
            <div className="site-status-banner-inner" role="note" aria-label="Önemli site notu">
              <span className="site-status-label">Canlı rehber alanı</span>
              <p className="site-status-copy">
                Site resmî kurum kararı vermez. Kullanıcıya sade açıklama, güvenli yönlendirme ve
                sonraki adımı netleştiren bir rehber sunar.
              </p>
            </div>
          </div>

          {children}

          <footer className="site-footer">
            <div className="footer-panel">
              <div className="section-header">
                <div>
                  <p className="section-label">Güven notu</p>
                  <h2 className="section-heading mt-3 text-[2rem]">
                    Doğru yönlendirme, sade akış ve açık anlatım
                  </h2>
                </div>
                <p className="section-copy max-w-xl">
                  Bu alanın amacı kullanıcıyı gereksiz karmaşıklıktan uzak tutmak, doğru teste
                  hızla taşımak ve sonuca anlamlı bağlam eklemektir.
                </p>
              </div>

              <div className="mt-5 flex flex-col flex-wrap gap-3 sm:flex-row">
                <Link href="/" className="secondary-link compact-link">
                  Tüm testler
                </Link>
                <Link href="/blog" className="secondary-link compact-link">
                  Blog
                </Link>
                <Link href="/hakkimizda" className="secondary-link compact-link">
                  Hakkımızda
                </Link>
                <Link href="/evde-bakim-maasi" className="secondary-link compact-link">
                  Evde Bakım rehberi
                </Link>
                <Link href="/start" className="secondary-link compact-link">
                  Evde Bakım testini aç
                </Link>
                <Link href="/iletisim" className="secondary-link compact-link">
                  İletişim
                </Link>
                <Link href="/yasal-uyari" className="secondary-link compact-link">
                  Yasal uyarı
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
