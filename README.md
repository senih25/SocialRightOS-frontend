# Sosyal Hak Rehberi – Dijital Sosyal Haklar Rehberlik Platformu

![Social Rights Guide](./public/assets/hero.jpg)

Frontend repository of **[https://sosyalhakrehberi.com/](https://sosyalhakrehberi.com/)**

Bireylerin Türkiye’deki sosyal haklarını anlamalarına ve bu haklara erişmelerine yardımcı olan kamu odaklı dijital platform.

* Website: [https://sosyalhakrehberi.com/](https://sosyalhakrehberi.com/)
* Instagram: [https://www.instagram.com/sosyalhizmet.danismanligi/](https://www.instagram.com/sosyalhizmet.danismanligi/)
* Contact: [info@sosyalhizmetdanismani.com](mailto:info@sosyalhizmetdanismani.com)

---

## OpenAI Build Week 2026

SocialRightOS is being prepared for the **Apps for Your Life** category with a narrow,
competition-period extension: an evidence-bound GPT-5.6 explanation layer for a
deterministic social-rights preliminary assessment.

**Public judge demo:** [https://social-right-os-frontend.vercel.app/gss-gelir-testi](https://social-right-os-frontend.vercel.app/gss-gelir-testi)

### The problem

Eligibility results can be difficult to understand. A generic model-generated answer is
not safe enough for this domain because it can overstate certainty, invent evidence or
appear to make an official decision.

### The authority boundary

The existing deterministic assessment remains the only source of the preliminary result.
GPT-5.6 receives only approved synthetic evidence and may restate one reason and one next
step in plain language. It cannot receive raw form answers, decision IDs or validation
payloads, and it cannot make, reverse or upgrade the eligibility outcome. Invalid output
is rejected as `UNAVAILABLE` while the deterministic result remains unchanged.

### What was added during Build Week

The product and its assessment tools existed before the competition extension. The
competition work is the commit range
[`1cee954...fd473bc`](https://github.com/senih25/SocialRightOS-frontend/compare/1cee954469bb9bf1c452271510c9f1a80afcc2b0...fd473bced8ddbe4cc6080648ae26542b82bcc284),
which adds:

- the evidence-bound explanation contract and adversarial semantic validation;
- the server-only GPT-5.6 provider and fail-closed API route;
- exact evidence-ID coverage and provider-input isolation;
- atomic PostgreSQL request, idempotency and USD 5 hard-spend guards;
- a public edge rate limit of 10 requests per 10 minutes per IP;
- the accessible synthetic GSS explanation panel and cross-benefit contract proof.

### Safe judge walkthrough

1. Open the public GSS demo above.
2. Use fabricated values only; do not enter a real name, identifier, health record or
   application data.
3. Complete the preliminary assessment.
4. In the Build Week panel, select **Sentetik açıklamayı oluştur** once.
5. Confirm that the explanation contains evidence-linked reason and next-step text and
   still states that it is not an official eligibility decision.

The Build Week panel uses a fixed synthetic evidence fixture. Form answers and the
preliminary result are not sent to GPT-5.6.

### Human, Codex and GPT-5.6 roles

| Actor | Responsibility |
| --- | --- |
| Human | Product scope, legal and privacy boundaries, approved evidence, budget and release decisions |
| Codex | Architecture, implementation, tests, security hardening and reproducible evidence |
| GPT-5.6 | Plain-language restatement of approved synthetic evidence only |

### Reproduce the quality gates

```bash
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run check:secrets
npm run check:diff
```

The final implementation pipeline passed `276/276` tests on Node.js 22. Full deployment,
provenance, cost-control and known-limitation evidence is recorded in
[the Build Week submission evidence](docs/product/build-week-submission-evidence.md).

Known limitations: this is preliminary guidance, not a government decision; only one
synthetic GSS AI scenario is enabled; impact has not been measured at population scale;
and no claim is made that every possible semantic violation or hallucination is detected.

---

## 🌍 What is this?

Sosyal Hak Rehberi, sosyal hakları:

* anlaşılabilir
* erişilebilir
* uygulanabilir

hale getirmeyi amaçlayan bir rehberlik platformudur.

Kullanıcılara:

* hangi haklara sahip olabileceklerini anlamalarını sağlar
* karar mantığını açık şekilde gösterir
* doğru sonraki adımları sunar

> Bu platform resmi bir devlet sistemi değildir, yalnızca rehberlik sağlar.

---

## 🎯 Why it exists

Birçok birey:

* haklarını bilmez
* yanlış başvuru yapar
* karmaşık süreçleri yönetemez

Bu platform:

* hatalı başvuruları azaltmayı
* farkındalığı artırmayı
* rehberlik sağlamayı

aamaclar.

---

## 🌍 Social Impact & Context

Sosyal haklara erişim önemli bir problemdir.

Resmi veriler ve saha gözlemleri göstermektedir ki:

* milyonlarca kişi sosyal yardımlardan faydalanmaktadır
* başvuruların önemli kısmı eksik veya hatalıdır
* birçok hak sahibi birey rehberlik eksikliği nedeniyle haklarına ulaşamaz

Bu durum:

* kurumlarda iş yükü oluşturur
* başvuru süreçlerini uzatır
* vatandaşların hak kaybına yol açar

---

## 🎯 Mission

Bireylerin sosyal haklarını doğru anlamasını sağlayan açık, yapılandırılmış ve erişilebilir bir rehberlik sistemi sunmak.

---

## 🚀 Vision

Milyonlarca kullanıcıya ulaşan, ölçeklenebilir bir **Sosyal Hak İşletim Sistemi** oluşturmak.

---

## ⚖️ Public Value

Bu platform:

* bireyleri güçlendirir
* kamu kaynaklarına adil erişimi destekler
* vatandaş-kurum arasındaki sürtünmeyi azaltır

---

## ⚙️ How it works

1. Kullanıcı testi başlatır
2. Bilgilerini girer
3. Frontend backend’e gönderir
4. Backend değerlendirir
5. Frontend sonucu gösterir:

   * karar
   * açıklama
   * sonraki adımlar

---

## 🧩 Product Position

* socialrightlabs → backend karar motoru
* sosyalhakrehberi-web → frontend

Frontend:

* UX
* SEO
* yönlendirme

Backend:

* karar
* kural
* uygunluk hesaplama

---

## ❗ Core Principle

> Backend decides, frontend renders

Frontend:

* karar vermez
* eşik hesaplamaz
* kural içermez

---

## 🔍 Example Output

```json
{
  "decision": "eligible",
  "confidence": "high",
  "rule_trace": [
    "income_below_threshold"
  ],
  "next_step": "Apply via local office"
}
```

---

## 📈 Scaling and Sustainability

Each guided test triggers backend processing.

As usage grows:

* API load increases
* infrastructure cost increases

To sustain the platform, these layers must continue operating reliably:

* backend engine
* hosting
* development
* maintenance

---

## 💖 Supporting the Project

This is a public-benefit system.

Support helps us:

* keep it free
* improve quality
* reach more people

---

## 🤝 Contributing

Use Issues for:

* bugs
* policy updates
* improvements

---

## 💬 Community

Use Discussions for ideas and feedback.

---

# Technical Documentation

## Tech Stack

* Next.js
* React
* TypeScript

## Local Development

```bash
npm ci
npm run dev
```

---

## License

This repository is proprietary and distributed under an **All Rights Reserved** notice.
See [LICENSE](LICENSE).
