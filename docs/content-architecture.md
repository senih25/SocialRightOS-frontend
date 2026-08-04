# Markdown Makale Katmanı Mimarisi (Aşama 4)

Durum: Uygulandı (2026-08-04). Bu aşamada **hiçbir gerçek makale yayımlanmadı**
ve mevcut dokuz blog yazısının karantinası **kaldırılmadı**.

## 1. Upstream sözleşme

| | |
|---|---|
| Depo | `senih25/socialrightlabs-contentops` |
| Dosya | `schemas/content/frontmatter-nextjs.schema.json` |
| Onaylı commit | `0fc7c6cc9e36a780634073bbfd1da1e29d682a94` |
| Onaylı snapshot | `src/lib/content/upstream-contract.snapshot.json` |
| Semantic digest | `0940a438546971dd96c05df2675ebbd496afdf91fbb7dbb2fd4780d90cbcb7b7` |

ContentOps'taki git dosyası **asıl otoritedir**. Buradaki snapshot yalnız insan
onaylı bir kopyadır ve kendi başına source-of-truth değildir.

`npm test` üç kademe uygular:

1. **Snapshot bütünlüğü:** commit'lenmiş snapshot'ın semantic SHA-256'sı onaylı
   digest ile aynı olmalı. Canonicalization nesne anahtarlarını sıralar, **dizi
   sırasını korur**.
2. **Sessiz gevşeme yok:** snapshot'tan **türetilen** fixture matrisi; upstream
   `required`, `additionalProperties:false`, `type`, `enum`, `pattern`,
   `minLength`/`maxLength` ve `format: date-time` kurallarının her birinin hâlâ
   zorlandığını ihlal fixture'larıyla kanıtlar. Alan adları ve enumlar snapshot'tan
   türetilir, elle kopyalanmaz.
3. **Canlı drift:** kardeş ContentOps deposu diskteyse tam belge digest'i
   karşılaştırılır; en küçük fark **FAIL** eder ve insan incelemesi ister.
   Otomatik snapshot güncellemesi yoktur.

## 2. Neden yalnız `.md` (MDX yok)

MDX gövdesi çalıştırılabilir JavaScript'tir. Otomatik bir üretim hattından gelen
içeriğin kod çalıştırabilmesi kabul edilemez: tek bir hatalı onay, ziyaretçinin
tarayıcısında keyfî kod anlamına gelir. Bu nedenle loader `.mdx` dosyalarını
**açık hata vererek reddeder** (sessizce atlamaz). İleride MDX gerekirse bu ayrı
bir güvenlik kararı gerektirir: bileşen allowlist'i, ifade yasağı ve ayrı bir
tehdit değerlendirmesi.

## 3. Akış

```text
content/articles/{slug}.md
  └─ frontmatter-parse.ts        (YAML alt kümesi; tahmin yerine hata)
      └─ article-frontmatter.ts  (upstream + daha sıkı site kuralları)
          └─ markdown-trust.ts   (MDAST allowlist + URL sınıflandırma)
              └─ articles-loader.ts  → articles.server.ts (server-only kapısı)
                  ├─ publishability.ts   (2. bağımsız kapı + kimlik invariantı)
                  ├─ app/blog/[slug]/page.tsx  (generateStaticParams, dynamicParams=false)
                  ├─ sitemap-projection.ts     (yalnız publishable, lastModified=updatedAt)
                  └─ blog-index-projection.ts  (yalnız publishable kartlar)
```

`markdown-render.ts` MDAST'i **React ağacına** çevirir: `dangerouslySetInnerHTML`
kullanılmaz, ham HTML eklentisi yoktur, haritada olmayan düğüm tipi hata fırlatır.
JSX yerine `createElement` kullanılır; böylece modül düz `.ts` kalır ve testler
gerçekten yayımlanan kodu çalıştırır.

## 4. Yayımlanabilirlik tablosu

| Durum | Route | Blog index | Sitemap |
|---|---|---|---|
| `verificationState != publishable` | ✗ | ✗ | ✗ |
| `publishable` + `noindex=true` | ✗ | ✗ | ✗ |
| `publishable` + `draft=true` | şema reddeder | — | — |
| `publishable` + `status != published` | şema reddeder | — | — |
| `publishable` + `reviewer=null` | şema reddeder | — | — |
| `publishable` + `legalStatus=unknown` | şema reddeder | — | — |
| **publishable + published + draft=false + noindex=false + reviewer + bilinen legalStatus** | ✓ | ✓ | ✓ |

`dynamicParams = false` sayesinde listede olmayan bir slug doğrudan URL ile
istendiğinde 404 döner; karantinadaki içerik URL'i bilinse bile render edilmez.
Route ayrıca `isPublishableArticle` ile **ikinci kez** kontrol eder.

## 5. Mevcut dokuz yazı

Dokuz `src/app/blog/{slug}/page.tsx` sayfası **hiç değiştirilmedi**: URL'leri,
canonical değerleri ve `robots: { index: false, follow: false }` karantinası
aynen korunmaktadır ve sitemap'e eklenmemişlerdir. Slug'ları
`src/lib/content/legacy-slugs.ts` içinde **rezerve** edilmiştir: bir Markdown
dosyası bu slug'lardan birini iddia ederse build kırılır. Next.js statik route
önceliği tek savunma olarak kabul edilmemiştir.

`contentRegistry.status === "published"` bir editoryal CMS bayrağıdır; kaynak
doğrulaması veya indekslenebilirlik yetkisi **değildir** ve ne route, ne index,
ne sitemap, ne de discovery seçicisinde kullanılır (testle zorlanır).

## 6. Discovery motorları neden yok

`docs/architecture/discovery-engines.md` (ContentOps) go/no-go kapıları henüz
aşılmadı: doğrulanmış/publishable makale sayısı sıfır, resmî route allowlist'i
tamamlanmadı ve Stage 6 kaynak izleme 14 gün çalışmadı. Bu nedenle hiçbir
discovery UI, programatik SEO veya facet sayfası üretilmemiştir.

**Discovery uygunluk seçicisi de yoktur - bilincli olarak.** ContentOps'un
`schemas/discovery/discovery-index-document.schema.json` sozlesmesi bir kaydin
indekse girebilmesi icin tam `publication_provenance` (`content_id`,
`merged_pr_url`, `published_at`), `content_hash` ve `primary_source_ids` ister.
Bu verilerin hicbiri Asama 4'te mevcut degildir: sirasiyla Asama 5 insan onay
kaydi, Asama 6 dogrulanmis kaynak olaylari ve Asama 7 draft-PR merge'i tarafindan
uretilir. Bir `ArticleEntry` bunlari tek basina asla karsilayamaz.

Bu alanlari yok sayan bir secici **yaniltici bir kapi** olurdu: gercek bir
discovery indeksinin reddetmesi gereken kayitlar icin "uygun" derdi. "Simdilik
hep bos donen" bir secici ise ayni hatayi davet eden olu kod olurdu. Ikisi de
reddedildi; fonksiyon **kaldirildi** ve bir test artik modulde discovery ile
ilgili hicbir disa aktarim bulunmadigini dogruluyor.

Discovery, Asama 5/6/7 tamamlandiktan sonra kurulacaktir. Girdisi `ArticleEntry`
degil, gercek publication provenance tasiyan ayri ve tam tipli bir kayit olmali;
zorunlu provenance alanlarinin her biri dogrulanmali ve **tek bir eksik alan bile
kaydi reddetmelidir**. Sahte `content_hash`, `content_id` veya PR URL'i uretilmez.

## 7. Sahte güncellik yasağı

Hiçbir yerde `new Date()`, build zamanı veya dosya sistemi mtime'ı yayın tarihi
olarak kullanılmaz. Sitemap `lastModified` yalnız doğrulanmış `updatedAt`
alanından gelir; ayrıştırılamayan tarih taşıyan kayıt bugünle damgalanmak yerine
**atlanır**. JSON-LD `datePublished`/`dateModified` de yalnız frontmatter'dan gelir.

## 8. Bilinen sınırlar

- Frontmatter ayristirici YAML'in **acikca tanimlanmis** kucuk bir alt kumesini
  destekler; `frontmatter-parse.ts` dosyasinin basindaki blok yorumda tam gramer
  yazilidir. Cift tirnakli degerler **JSON string semantigiyle** dogrulanir
  (yalniz JSON kacislari; desteklenmeyen kacis dizileri reddedilir), kapanmamis
  tirnak ve kapanan tirnaktan sonra kalan karakterler hata verir, dizi bolme
  yalniz tirnak disindaki virgullerde yapilir, tirnaksiz degerdeki basibos tirnak
  reddedilir. **Tek tirnakli skalerler bilincli olarak reddedilir**: YAML'in ikinci
  tirnak dialektini desteklemek kacis yuzeyini iki katina cikarirdi ve uretici
  adaptor zaten cift tirnak yaziyor. Desteklenmeyen hicbir yapi sessizce
  yorumlanmaz.
- Görsel (`image`) düğümü şimdilik reddedilir: uzak görsel referansı ek bir
  güvenilmeyen bağlantıdır ve MVP içerik modelinde gerekli değildir.
- `http://` bağlantılar reddedilir (downgrade); yalnız HTTPS/mailto/iç bağlantı
  kabul edilir.
- Bağımlılık uyarıları (baseline'dan devralınan `next`, `sharp`, `postcss`,
  `brace-expansion`) bu commit'in kapsamı dışındadır ve ayrı bir güvenlik
  güncellemesi commit'i gerektirir.

## 9. Rollback

```
git -C C:\PROJELER\senihbayankulu-com worktree remove C:\PROJELER\worktrees\socialrightos-stage4
git branch -D sr/automation-phase-4-nextjs-content
```

Hiçbir şey push edilmediği için origin etkilenmez; mevcut checkout ve `tmp/`
klasörü dokunulmamıştır.
