# Build Week — Hak Rehberi Açıklama Özeti

## Durum

Bu dilim yalnız provider-independent offline çekirdek ve daraltılmış çıktı sözleşmesidir.
Canlı OpenAI çağrısı, API anahtarı, public AI enablement, kullanıcı arayüzü ve deployment
bu kapsamda değildir.

```text
BASE_SHA=1cee954469bb9bf1c452271510c9f1a80afcc2b0
LIVE_API_INTEGRATION=BLOCKED
DETERMINISTIC_ASSESSMENT_RESULT=UNCHANGED
FREE_FORM_PROVIDER_SUMMARY=REMOVED
PROVIDER_OWNED_LIMITATIONS=REMOVED
APPLICATION_OWNED_COPY=PASS
SEMANTIC_FIDELITY_GUARD=PASS
EXACT_EVIDENCE_COVERAGE=PASS
PROVIDER_INPUT_ISOLATION=PASS
```

## Güvenlik sınırı

GPT-5.6 gelecekte yalnız onaylı açıklama metinlerini sadeleştirebilir. Uygunluk kararı,
resmî hak tespiti, yeni gerekçe veya yeni sonraki adım üretemez. Ham form cevapları,
backend payload, decision ID, hane üyesi verisi ve sağlık/engellilik ayrıntısı model
paketine alınmaz.

Akış:

```text
explicit evidence-id selection
→ approved catalog lookup
→ RightsGuidanceInput
→ provider
→ strict two-collection response-shape validation
→ exact selected-evidence coverage validation
→ concrete-claim, semantic polarity and certainty scan
→ allowlisted render model or UNAVAILABLE
```

## Offline sözleşmeler

- `RightsGuidanceInput`: yalnız katalogdan yeniden üretilen onaylı alanlar.
- `RightsGuidanceProvider`: mock ve ilerideki live provider için ortak sınır.
- `RightsGuidanceExplanation`: yalnız kanıt kimliğine bağlı gerekçe ve sonraki-adım
  açıklamalarından oluşan advisory çıktı.
- `RightsGuidanceApplicationCopy`: modelden bağımsız başlık, özet, sınırlama ve disclaimer.
- `RightsGuidanceAtomicBudgetStore`: canlı entegrasyon öncesi uygulanması gereken atomik
  rezervasyon/settlement sınırı.
- `DeterministicRightsGuidanceMockProvider`: yalnız sentetik test ve demo geliştirmesi.

Live provider, mevcut offline orchestrator tarafından bilinçli olarak `UNAVAILABLE`
davranışına zorlanır.

Provider çıktısında serbest özet, status, sınırlama veya disclaimer kabul edilmez. Ek alan,
eksik/fazla/bilinmeyen/tekrarlanan/yanlış bölüme ait kanıt kimliği, desteklenmeyen somut
iddia, onaylı anlamın tersine çevrilmesi, resmî karar ve kesinlik/garanti dili fail-closed
olarak reddedilir. Boş gerekçe veya sonraki-adım koleksiyonları yalnız seçilen ilgili kanıt
kümesi de boşsa geçerlidir.

Provider girdisi ana girdiden iki ayrı `structuredClone()` ile ayrılır. Provider kopyası
özyinelemeli olarak dondurulur; doğrulama ise provider'ın erişemediği ikinci kopyaya karşı
yapılır. Böylece in-process provider mutasyon girişimi ana girdiyi veya doğrulama temelini
değiştiremez.

## Phase 1.1 güvenlik kapanışı

Timestamp'li keşif, PoC, ledger ve ara raporlar yalnız işletim sistemi geçici dizininde
üretildi; repository içine alınmadı. Kalıcı kaynak olarak bu küratörlü özet ve adversarial
regresyon testleri korunur. Çalışma ortamı recursive temp silme komutunu çalıştırmadan
engellediği için ham dizin repository dışında işletim sistemi temp yaşam döngüsüne bırakıldı.
Repository köküne taşınmasını önlemek üzere hem `/.codex-security-scans/` hem de
`/codex-security-scans/` ignore edildi.

```text
CURATED_SECURITY_REPORT=KEEP
RAW_SCAN_ARTIFACTS=IGNORED_OUTSIDE_REPOSITORY
RAW_SCAN_ARTIFACT_REPOSITORY_COUNT=0
RAW_TEMP_REMOVAL=BLOCKED_BY_EXECUTION_POLICY
LIVE_API_CALL_COUNT=0
PAID_API_USAGE=0
```

## Sonraki kapılar

1. Katılımcı uygunluğu, Devpost kaydı ve repository erişim stratejisi için insan teyidi.
2. Ayrı OpenAI API project, billing ve seçilen GPT-5.6 model erişimi.
3. Kullanıcı tarafından onaylanan azami harcama tutarı.
4. Atomik ve kalıcı budget store uygulaması.
5. Sentetik minimal Responses API çağrısı ve structured-output doğrulaması.
6. GSS için tek onaylı pilot katalog ve UI entegrasyonu.
7. Erişilebilirlik, public demo SHA, provenance README ve `/feedback` Session ID.

Bu kapılar geçmeden canlı model çağrısı veya public AI özelliği açılmaz.
