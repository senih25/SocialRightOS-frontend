export type OfficialSourceProfileKey = "home-care" | "old-age" | "birth-grant";

export type OfficialSource = {
  title: string;
  publisher: string;
  url: string;
  role: string;
};

export type OfficialSourceProfile = {
  updatedAt: string;
  verifiedAt: string;
  sources: readonly OfficialSource[];
};

const MINISTRY = "T.C. Aile ve Sosyal Hizmetler Bakanlığı";

export const OFFICIAL_SOURCE_PROFILES: Readonly<
  Record<OfficialSourceProfileKey, OfficialSourceProfile>
> = {
  "home-care": {
    updatedAt: "2026-08-27",
    verifiedAt: "2026-08-08",
    sources: [
      {
        title: "Evde Bakım Yardımı ve Gündüz Hizmetleri",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/sss/engelli-ve-yasli-hizmetleri-genel-mudurlugu/evde-bakim-yardimi-ve-gunduz-hizmetleri/",
        role: "Evde bakım yardımının temel şartları, gelir kriteri, rapor şartı ve başvuru çerçevesi.",
      },
      {
        title: "Evde Bakım Yardımı Yönetmeliği",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/eyhgm/mevzuat/ulusal-mevzuat/yonetmelikler/evde-bakim-yardimi-yonetmeligi-1/",
        role: "Başvuru, değerlendirme ve idari uygulama usulüne ilişkin resmî mevzuat kaynağı.",
      },
    ],
  },
  "old-age": {
    updatedAt: "2026-08-27",
    verifiedAt: "2026-08-08",
    sources: [
      {
        title: "Sosyal Yardım Programlarımız",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/sygm/programlarimiz/sosyal-yardim-programlarimiz/",
        role: "Yaşlı aylığının güncel program koşulları ve yardım çerçevesi.",
      },
      {
        title: "2022 Sayılı Kanun Kapsamındaki Engelli ve Yaşlı Aylıkları",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/sss/sosyal-yardimlar-genel-mudurlugu/2022-kanun-kapsaminda-yurutulen-ayliklar/",
        role: "Başvuru, muhtaçlık değerlendirmesi ve aylıkların birlikte değerlendirilmesine ilişkin resmî SSS kaynağı.",
      },
    ],
  },
  "birth-grant": {
    updatedAt: "2026-08-27",
    verifiedAt: "2026-08-08",
    sources: [
      {
        title: "Sosyal Yardım Programlarımız",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/sygm/programlarimiz/sosyal-yardim-programlarimiz/",
        role: "Doğum yardımının güncel ödeme yapısı ve program çerçevesi.",
      },
      {
        title: "Doğum Yardımı",
        publisher: MINISTRY,
        url: "https://www.aile.gov.tr/btgmd/e-hizmetler-yeni/dogum-yardimi/",
        role: "Başvuru, değerlendirme ve ödeme takibinin dijital kanallarına ilişkin resmî e-hizmet kaynağı.",
      },
    ],
  },
};

export function getOfficialSourceProfile(
  key: OfficialSourceProfileKey,
): OfficialSourceProfile {
  return OFFICIAL_SOURCE_PROFILES[key];
}
