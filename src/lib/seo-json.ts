export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
  url?: string;
};

const jsonLdEscapes: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export function serializeJsonLd(data: unknown): string {
  const serialized = JSON.stringify(data);
  if (typeof serialized !== "string") return "null";
  return serialized.replace(/[<>&\u2028\u2029]/gu, (character) => jsonLdEscapes[character]);
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(params: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    url: params.url,
    step: params.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
    })),
  };
}

export function buildBrandGraphJsonLd(params: {
  siteUrl: URL;
  founder: {
    name: string;
    role: string;
    summary: string;
  };
  organization: {
    name: string;
    description: string;
    profilePath: string;
  };
  product: {
    name: string;
    fullName: string;
    description: string;
  };
  socialProfiles: Record<string, string>;
}) {
  const websiteId = new URL("/#website", params.siteUrl).toString();
  const organizationId = new URL(
    `${params.organization.profilePath}#organization`,
    params.siteUrl,
  ).toString();
  const founderId = new URL("/#founder", params.siteUrl).toString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: params.organization.name,
        description: params.organization.description,
        url: new URL(
          params.organization.profilePath,
          params.siteUrl,
        ).toString(),
        founder: {
          "@id": founderId,
        },
      },
      {
        "@type": "Person",
        "@id": founderId,
        name: params.founder.name,
        jobTitle: params.founder.role,
        description: params.founder.summary,
        worksFor: {
          "@id": organizationId,
        },
        sameAs: Object.values(params.socialProfiles),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: params.product.name,
        alternateName: params.product.fullName,
        description: params.product.description,
        url: params.siteUrl.toString(),
        publisher: {
          "@id": organizationId,
        },
        creator: {
          "@id": founderId,
        },
        inLanguage: "tr-TR",
        accessMode: ["textual", "visual"],
        accessModeSufficient: [
          {
            "@type": "ItemList",
            itemListElement: ["textual"],
          },
        ],
        accessibilityFeature: [
          "alternativeText",
          "displayTransformability",
          "readingOrder",
          "structuralNavigation",
        ],
        accessibilitySummary:
          "Her sayfada editoryal metadata ile üretilen kısa bir metin özeti ve tarayıcı destekliyorsa Türkçe seslendirme seçeneği sunulur.",
      },
    ],
  };
}
