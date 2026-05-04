export type ContactChannelKind = "instagram" | "email" | "whatsapp" | "linkedin";

export type ContactChannel = {
  kind: ContactChannelKind;
  label: string;
  href: string;
  value: string;
  note: string;
};

export type SiteProfile = {
  siteName: string;
  tagline: string;
  mission: string;
  vision: string;
  founderName: string;
  founderRole: string;
  founderSummary: string;
  professionalSummary: string;
  expertise: string[];
  education: string[];
  certificates: string[];
  contactChannels: ContactChannel[];
  trustPoints: string[];
};

export const siteProfile: SiteProfile = {
  siteName: "Sosyal Hak Rehberi",
  tagline: "Dijital Sosyal Hak Rehberi",
  mission:
    "Sosyal haklara erişimi sade, anlaşılır ve güven veren bir rehberlik deneyimine dönüştürmek.",
  vision:
    "Türkiye'de sosyal hak bilgisini erişilebilir, anlaşılır ve doğru adıma yönlendiren bir dijital rehber standardında sunmak.",
  founderName: "Senih Bayankulu",
  founderRole: "Dijital Sosyal Hak Rehberi Fikir Mimarı",
  founderSummary:
    "Sosyal hak başlıklarını sadeleştiren, başvuru ve değerlendirme süreçlerini kullanıcı açısından okunabilir hale getirmeyi hedefleyen bir çalışma yaklaşımına sahiptir.",
  professionalSummary:
    "Adalet, kamu yönetimi, iktisat ve sosyal hizmet ekseninde şekillenen bir akademik ve pratik arka planla, sosyal hak bilgisini daha anlaşılır ve düzenli bir sunuma taşımayı amaçlar.",
  expertise: [
    "UYAP ve e-Devlet süreçleri",
    "Evrak ve dosya düzeni",
    "Sosyal hak bilgilendirmesi",
    "SGK ve sağlık raporu süreçleri",
    "Danışan iletişimi",
    "Analitik değerlendirme ve raporlama",
  ],
  education: [
    "Dokuz Eylül Üniversitesi - Adalet MYO",
    "Manisa Celal Bayar Üniversitesi - Kamu Yönetimi",
    "İzmir Demokrasi Üniversitesi - İktisat Yüksek Lisans",
    "Atatürk Üniversitesi - Sosyal Hizmetler Lisans (devam ediyor)",
  ],
  certificates: [
    "Sorumlu Emlak Danışmanı (Seviye 5) - MYK",
    "ISO 9001:2015 Kalite Yönetim Sistemi İç Denetçi Sertifikası",
    "Eğitim Koçluğu Sertifikası",
    "İŞKUR İş Kulübü Katılım Sertifikası",
  ],
  contactChannels: [
    {
      kind: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/sosyalhizmet.danismanligi/",
      value: "@sosyalhizmet.danismanligi",
      note: "Kısa duyurular ve güncel yönlendirmeler için.",
    },
    {
      kind: "email",
      label: "E-posta",
      href: "mailto:info@sosyalhizmetdanismani.com",
      value: "info@sosyalhizmetdanismani.com",
      note: "Detaylı başvuru ve bilgi talepleri için.",
    },
    {
      kind: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/905451413294",
      value: "+90 545 141 32 94",
      note: "Hızlı iletişim ve kısa ön yönlendirme için.",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/senih25/",
      value: "senih25",
      note: "Profesyonel geçmiş ve deneyim özeti için.",
    },
  ],
  trustPoints: [
    "Site resmî kurum değildir; ön değerlendirme ve rehberlik sunar.",
    "Gereksiz kişisel veri istemeden, sade ve anlaşılır bir akış hedefler.",
    "Sonuçlar açıklanabilir biçimde gösterilir; kaynak ve gerekçe ile desteklenir.",
  ],
};
