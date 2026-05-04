export type MethodologySection = {
  title: string;
  body: string[];
};

export type MethodologyLink = {
  href: string;
  label: string;
};

export type MethodologyContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: MethodologySection[];
  links: MethodologyLink[];
  disclaimer: string;
};

export const homeCareMethodologyContent: MethodologyContent = {
  eyebrow: "Yöntem ve Sınırlar",
  title: "Dijital Sosyal Hak Rehberi nasıl çalışır?",
  subtitle:
    "Bu sayfa, sitenin hangi ilkelere göre içerik ürettiğini, nasıl sonuç gösterdiğini ve neden ön değerlendirme yaklaşımı kullandığını açıklar.",
  sections: [
    {
      title: "Ne tür bir sistemdir?",
      body: [
        "Site, kullanıcıyı karmaşık mevzuat metinleriyle baş başa bırakmayan bir rehber katmanı olarak tasarlanmıştır.",
        "Her sayfa tek bir konuya odaklanır; kısa açıklama, gerekçe ve sonraki adım aynı akışta sunulur.",
        "Amaç, resmî işlemin yerini almak değil; doğru bilgiye daha kısa yoldan ulaşmayı kolaylaştırmaktır.",
      ],
    },
    {
      title: "Hangi ilkelerle çalışır?",
      body: [
        "İçerik sade dilde yazılır ve teknik ayrıntılar yalnızca gerektiği kadar kullanılır.",
        "Her başlık, tek bir kullanıcı sorusuna net yanıt vermeyi hedefler.",
        "Aşırı iddia, belirsiz yönlendirme ve gereksiz veri toplama bu yaklaşımın parçası değildir.",
      ],
    },
    {
      title: "Sonuçlar nasıl gösterilir?",
      body: [
        "Önce temel durum okunur, sonra gerekçeler ve eksik bilgiler açıklanır.",
        "Sonuçlar açıklanabilir biçimde sunulur; kullanıcı, neden o sonuca ulaşıldığını görebilir.",
        "Nihai kararın ilgili kurum tarafından verildiği her zaman açık tutulur.",
      ],
    },
    {
      title: "Kurucu yaklaşım",
      body: [
        "Senih Bayankulu'nun dijital sosyal hak rehberi yaklaşımı, bilgiyi gösterişli bir dilden uzaklaştırıp düzenli ve okunabilir hale getirmeye dayanır.",
        "Kurucu profil, içeriklerin tonunu belirler; ancak sayfanın ana hedefi kurucu vitrini değil, kullanıcıya faydalı yönlendirme sağlamaktır.",
      ],
    },
  ],
  links: [
    {
      href: "/hakkimizda",
      label: "Kurucu ve vizyon notunu oku",
    },
    {
      href: "/start",
      label: "Evde bakım testini aç",
    },
    {
      href: "/evde-bakim-maasi",
      label: "Evde bakım rehberine git",
    },
    {
      href: "/blog",
      label: "Blog ve analizleri gör",
    },
  ],
  disclaimer:
    "Bu site resmî karar vermez. Ön değerlendirme ve rehberlik sunar; nihai sonuçlar ilgili kurumların güncel incelemesiyle belirlenir.",
};
