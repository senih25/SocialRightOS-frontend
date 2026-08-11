import type { MetadataRoute } from "next";
import { loadArticles } from "@/lib/content/articles.server";
import { buildArticleSitemapEntries } from "@/lib/content/sitemap-projection";
import { getSiteUrl, isProductionSite } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (!isProductionSite(siteUrl)) {
    return [];
  }

  const routes = [
    "/",
    "/blog",
    "/dogum-yardimi-uygunluk-testi",
    "/dogum-yardimi-uygunluk-testi/e-devlet-basvurusu",
    "/dogum-yardimi-uygunluk-testi/odeme-takvimi",
    "/dogum-yardimi-uygunluk-testi/rehber",
    "/dogum-yardimi-uygunluk-testi/sss",
    "/hakkimizda",
    "/iletisim",
    "/gizlilik-ve-kvkk",
    "/kullanim-kosullari",
    "/kaynak-ve-guncellik-politikasi",
    "/65-yas-ayligi-uygunluk-testi",
    "/65-yas-ayligi-uygunluk-testi/rehber",
    "/gss-gelir-testi",
    "/gss-gelir-testi/rehber",
    "/evde-bakim-maasi",
    "/evde-bakim-maasi/hesaplama",
    "/evde-bakim-maasi/basvuru-rehberi",
    "/evde-bakim-maasi/sartlar",
    "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
    "/methodology",
    "/socialrightlabs",
    "/yasal-uyari",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route === "/" ? "weekly" : "daily",
    priority: route === "/" ? 1 : 0.8,
  }));

  // Markdown articles: only publishable ones, `lastModified` from frontmatter
  // `updatedAt` alone. The nine quarantined legacy /blog pages are not part of
  // this collection and stay out of the sitemap.
  const staticUrls = new Set(staticEntries.map((entry) => entry.url));
  const articleEntries = buildArticleSitemapEntries(loadArticles(), siteUrl).filter(
    (entry) => !staticUrls.has(entry.url),
  );

  return [...staticEntries, ...articleEntries];
}
