import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { loadArticles } from "@/lib/content/articles.server";
import { renderArticleMarkdown } from "@/lib/content/markdown-render";
import { parseSafeArticleMarkdown } from "@/lib/content/markdown-trust";
import { isPublishableArticle, selectPublishableArticles, type ArticleEntry } from "@/lib/content/publishability";
import { buildBreadcrumbJsonLd } from "@/lib/seo-json";
import { getSiteUrl } from "@/lib/site";

/**
 * Dynamic route for Markdown articles: /blog/{slug}
 *
 * Only entries that pass `isPublishableArticle` receive a path. Draft, review,
 * archived, quarantined and noindex entries produce no route at all, which is
 * also why they can never appear in the sitemap.
 *
 * `dynamicParams = false` means a slug that is not in `generateStaticParams`
 * yields a 404 instead of being rendered on demand — a quarantined article
 * cannot be reached by typing its URL.
 *
 * The nine legacy `/blog/{slug}` pages are static routes and keep precedence;
 * additionally, a Markdown file claiming one of those slugs breaks the build
 * (`assertUniqueArticleIdentity`), so precedence is not the only defence.
 */
export const dynamicParams = false;

const LEGAL_STATUS_LABELS: Record<string, string> = {
  in_force: "Yürürlükte",
  proposed: "Teklif aşamasında",
  amended: "Değiştirilmiş",
  repealed: "Yürürlükten kaldırılmış",
  guidance: "Rehber / bağlayıcı olmayan",
  not_applicable: "Uygulanabilir değil",
  unknown: "Belirsiz",
};

function findPublishableEntry(slug: string): ArticleEntry | null {
  const entry = loadArticles().find((candidate) => candidate.frontmatter.slug === slug);
  // Second, independent fail-closed check: never trust the params alone.
  if (!entry || !isPublishableArticle(entry)) return null;
  return entry;
}

export function generateStaticParams(): { slug: string }[] {
  return selectPublishableArticles(loadArticles()).map((entry) => ({ slug: entry.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findPublishableEntry(slug);
  if (!entry) {
    return { robots: { index: false, follow: false } };
  }
  const data = entry.frontmatter;
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `/blog/${data.slug}` },
    robots: { index: true, follow: true },
  };
}

const isoDay = (value: string) => value.slice(0, 10);

export default async function MarkdownArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findPublishableEntry(slug);
  if (!entry) notFound();

  const data = entry.frontmatter;
  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(`/blog/${data.slug}`, siteUrl).toString();

  const tree = parseSafeArticleMarkdown(entry.body, { id: entry.fileId });
  const bodyElements = renderArticleMarkdown(tree);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana sayfa", url: new URL("/", siteUrl).toString() },
    { name: "Blog", url: new URL("/blog", siteUrl).toString() },
    { name: data.title, url: canonicalUrl },
  ]);

  // Every value below comes from validated frontmatter. No build timestamp is
  // used anywhere, so a rebuild cannot invent a fresh modification date.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    inLanguage: "tr-TR",
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    author: { "@type": "Person", name: data.author },
    ...(data.reviewer ? { reviewedBy: { "@type": "Person", name: data.reviewer } } : {}),
    about: data.benefitOrRight,
    citation: [...data.primarySources, ...data.secondarySources],
  };

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <JsonLd id="breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLd id="article-jsonld" data={articleJsonLd} />

      <div className="mx-auto max-w-3xl space-y-8">
        <nav aria-label="Sayfa yolu" className="text-xs text-slate-500">
          <Link href="/blog" className="underline">
            Blog
          </Link>
        </nav>

        <header className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
          <p className="text-sm text-slate-600">{data.description}</p>
        </header>

        <section aria-labelledby="article-provenance" className="card-panel space-y-2 text-sm">
          <h2 id="article-provenance" className="text-base font-semibold text-slate-900">
            Kaynak ve doğrulama bilgisi
          </h2>
          <dl className="grid gap-1">
            <div>
              <dt className="inline font-medium">Konu: </dt>
              <dd className="inline">{data.benefitOrRight}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Yazar: </dt>
              <dd className="inline">{data.author}</dd>
            </div>
            <div>
              <dt className="inline font-medium">İnceleyen: </dt>
              <dd className="inline">{data.reviewer}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Yayımlanma: </dt>
              <dd className="inline">
                <time dateTime={data.publishedAt}>{isoDay(data.publishedAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Son güncelleme: </dt>
              <dd className="inline">
                <time dateTime={data.updatedAt}>{isoDay(data.updatedAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Kaynakların son kontrol tarihi: </dt>
              <dd className="inline">
                <time dateTime={data.sourceCheckedAt}>{isoDay(data.sourceCheckedAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Hukuki durum: </dt>
              <dd className="inline">{LEGAL_STATUS_LABELS[data.legalStatus] ?? data.legalStatus}</dd>
            </div>
            {data.effectiveDate ? (
              <div>
                <dt className="inline font-medium">Yürürlük tarihi: </dt>
                <dd className="inline">
                  <time dateTime={data.effectiveDate}>{data.effectiveDate}</time>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="inline font-medium">Yapay zeka desteği: </dt>
              <dd className="inline">{data.aiAssistance}</dd>
            </div>
          </dl>
        </section>

        <article className="space-y-4">{bodyElements}</article>

        <section aria-labelledby="article-sources" className="card-panel space-y-3 text-sm">
          <h2 id="article-sources" className="text-base font-semibold text-slate-900">
            Birincil kaynaklar
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            {data.primarySources.map((source) => (
              <li key={source}>
                <a href={source} rel="noopener noreferrer nofollow" target="_blank" className="underline">
                  {source}
                </a>
              </li>
            ))}
          </ol>
          {data.secondarySources.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold text-slate-900">İkincil kaynaklar</h3>
              <ol className="list-decimal space-y-1 pl-5">
                {data.secondarySources.map((source) => (
                  <li key={source}>
                    <a href={source} rel="noopener noreferrer nofollow" target="_blank" className="underline">
                      {source}
                    </a>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </section>

        <section aria-labelledby="article-disclaimer" className="card-panel space-y-2 text-sm text-slate-600">
          <h2 id="article-disclaimer" className="text-base font-semibold text-slate-900">
            Yasal uyarı
          </h2>
          <p>{data.disclaimer}</p>
          <p>
            Bu site resmî bir kurum değildir ve resmî kurumları temsil etmez. Bağlayıcı olan, ilgili
            kurumun kendi yayını ve kararıdır.
          </p>
        </section>
      </div>
    </main>
  );
}
