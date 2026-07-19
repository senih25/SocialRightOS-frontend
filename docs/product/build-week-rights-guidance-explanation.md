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
→ evidence-id validation
→ concrete-claim and certainty scan
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
bilinmeyen/tekrarlanan/yanlış bölüme ait kanıt kimliği, desteklenmeyen somut iddia ve kesinlik
dili fail-closed olarak reddedilir. Boş gerekçe veya sonraki-adım koleksiyonları geçerli bir
durum olarak korunur.

## Sonraki kapılar

1. Katılımcı uygunluğu, Devpost kaydı ve repository erişim stratejisi için insan teyidi.
2. Ayrı OpenAI API project, billing ve seçilen GPT-5.6 model erişimi.
3. Kullanıcı tarafından onaylanan azami harcama tutarı.
4. Atomik ve kalıcı budget store uygulaması.
5. Sentetik minimal Responses API çağrısı ve structured-output doğrulaması.
6. GSS için tek onaylı pilot katalog ve UI entegrasyonu.
7. Erişilebilirlik, public demo SHA, provenance README ve `/feedback` Session ID.

Bu kapılar geçmeden canlı model çağrısı veya public AI özelliği açılmaz.
