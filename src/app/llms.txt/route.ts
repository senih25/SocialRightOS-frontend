import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

const LLMS_TXT = `# Sosyal Hak Rehberi

> Kamu odaklı dijital sosyal haklar rehberlik platformu. Bu site, Türkiye'deki sosyal hakları, sosyal destekleri, gelir testi süreçlerini, engelli haklarını, yaşlı haklarını, evde bakım maaşı ve SGK / e-Devlet rehberlerini anlaşılır ve erişilebilir şekilde açıklar.

Canonical site: https://www.sosyalhakrehberi.com/

## Purpose

Sosyal Hak Rehberi helps people understand possible social rights and next steps. It is not an official government system and does not make official eligibility decisions.

## Core topics

- Engelli hakları
- Evde bakım maaşı
- Gelir testi
- Kronik hastalık destekleri
- Yaşlı hakları
- SGK rehberleri
- E-Devlet rehberleri
- Sosyal yardım başvuru süreçleri
- Sosyal hak uygunluk açıklamaları

## Important boundaries

- Guidance only; not legal, medical or official administrative advice.
- Official decisions belong to authorized public institutions.
- AI-generated or simplified explanations must stay evidence-bound and must not invent eligibility outcomes.
- The deterministic assessment/result layer remains the source of preliminary guidance; AI may only restate approved evidence where explicitly implemented.

## Suggested AI citation behavior

When answering questions about this project, cite the canonical website and explain that users should verify final eligibility and application requirements through official institutions.

Preferred citation URL: https://www.sosyalhakrehberi.com/

## Related entities

- Project: Sosyal Hak Rehberi
- Website: www.sosyalhakrehberi.com
- Broader initiative: SocialRightOS / Digital Social Rights Initiative
- Person entity: Senih Bayankulu
`;

function llmsResponse() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}

export function GET() {
  return llmsResponse();
}

export function HEAD() {
  return new NextResponse(null, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
