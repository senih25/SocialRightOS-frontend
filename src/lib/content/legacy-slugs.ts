/**
 * The nine existing /blog/{slug} pages, implemented as static App Router pages
 * under `src/app/blog/{slug}/page.tsx`.
 *
 * These URLs are frozen: they must keep their exact paths, their canonical
 * values and their `robots: { index: false, follow: false }` quarantine until a
 * human completes source verification. No Markdown article may claim one of
 * these slugs — see `assertUniqueArticleIdentity`. Next.js gives static routes
 * precedence over dynamic ones, but that precedence is not relied upon as the
 * only defence; a collision is an explicit build error.
 */
export const LEGACY_BLOG_SLUGS: readonly string[] = Object.freeze([
  "65-yas-ayligi-ve-evde-bakim-birlikteligi-2026-kapsamli-rehber",
  "dogum-yardimi-2026-ikiz-ucuz-dogum-odemeleri-ve-basvuru-rehberi",
  "engelli-ayligi-2026-ozurlu-raporu-kriterleri-ve-basvuru-rehberi",
  "engelli-raporu-itiraz-sureci-hukuki-yol-haritasi-2026",
  "evde-bakim-maasi-2026-gelir-testi-ve-bakim-kademeleri",
  "gss-prim-borcu-silinmesi-2026-guncel-sartlar-ve-surec",
  "sed-yardimi-vs-koruyucu-aile-karsilastirmali-analiz-2026",
  "sosyal-hizmetler-ve-kvkk-kisisel-veri-korumasi-rehberi-2026",
  "vatandaslik-maasi-2026-kimler-yararlanacak-basvuru-sartlari-ve-tutarlar-belli-oldu",
]);

/** True when a slug belongs to one of the nine quarantined legacy pages. */
export function isLegacyBlogSlug(slug: string): boolean {
  return LEGACY_BLOG_SLUGS.includes(slug);
}
