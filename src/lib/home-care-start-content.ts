export type StartChecklistItem = {
  title: string;
  body: string;
};

export type StartContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  checklistHeading: string;
  checklist: StartChecklistItem[];
  durationHeading: string;
  durationBody: string[];
  disclaimerHeading: string;
  disclaimerBody: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export const homeCareStartContent: StartContent = {
  eyebrow: "Başlangıç",
  title: "Evde bakım maaşı için ön değerlendirme hazırlığı",
  subtitle:
    "Temel bilgileri netleştirerek ön değerlendirme akışını daha düzenli ve anlaşılır biçimde kullanabilirsiniz.",
  checklistHeading: "Kontrol etmeniz gereken temel başlıklar",
  checklist: [
    {
      title: "Hane bilgisi",
      body: "Evde kimlerin yaşadığını ve toplam kişi sayısını netleştirin.",
    },
    {
      title: "Gelir özeti",
      body: "Yaklaşık hane gelir kaynaklarını ve aylık toplamı not edin.",
    },
    {
      title: "Bakım ihtiyacı",
      body: "Tam bağımlı bakım ihtiyacını yüksek seviyede nasıl tarif edeceğinizi düşünün.",
    },
  ],
  durationHeading: "Bu akış ne kadar sürer?",
  durationBody: [
    "Genelde 3–6 dakika sürer.",
    "Tahmini bilgilerle başlayabilirsiniz; resmî inceleme için ayrıca belge gerekebilir.",
  ],
  disclaimerHeading: "Kapsam notu",
  disclaimerBody: [
    "Bu araç resmî karar vermez.",
    "Girdiğiniz bilgilere dayalı ön bakış ve yönlendirme sunar.",
  ],
  primaryHref: "/evde-bakim-maasi/hesaplama",
  primaryLabel: "Ön değerlendirmeyi aç",
  secondaryHref: "/methodology",
  secondaryLabel: "Yöntemi incele",
};
