import type { AnalyticsRegistryEntry } from "@/lib/admin-types";

export const analyticsRegistry: AnalyticsRegistryEntry[] = [
  {
    id: "event-page-view",
    event_name: "page_view",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-assessment-started",
    event_name: "assessment_started",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-assessment-completed",
    event_name: "assessment_completed",
    surface: "result",
    enabled: true,
  },
  {
    id: "event-assessment-validation-failed",
    event_name: "assessment_validation_failed",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-assessment-api-failed",
    event_name: "assessment_api_failed",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-result-cta-clicked",
    event_name: "result_cta_clicked",
    surface: "result",
    enabled: true,
  },
  {
    id: "event-feedback-opened",
    event_name: "feedback_opened",
    surface: "tool-page",
    enabled: true,
  },
];

export const analyticsProviderRegistry = [
  {
    id: "ga4",
    label: "Google Analytics 4",
    env: "NEXT_PUBLIC_GA4_ID",
    purpose: "Traffic, dönüşüm ve sayfa performansı",
  },
  {
    id: "search-console",
    label: "Google Search Console",
    env: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
    purpose: "Arama görünürlüğü ve doğrulama",
  },
  {
    id: "tag-manager",
    label: "Google Tag Manager",
    env: "NEXT_PUBLIC_GTM_ID",
    purpose: "Etiket yönetimi ve esnek olay takibi",
  },
  {
    id: "clarity",
    label: "Microsoft Clarity",
    env: "NEXT_PUBLIC_CLARITY_ID",
    purpose: "Isı haritası ve oturum analizi",
  },
] as const;
