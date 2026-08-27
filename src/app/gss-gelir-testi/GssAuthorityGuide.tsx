export const gssAuthorityFaq = [
  {
    question: "GSS gelir testi için nereye başvurulur?",
    answer:
      "Resmî gelir tespiti başvurusu, ikametgâhın bulunduğu il veya ilçedeki Sosyal Yardımlaşma ve Dayanışma Vakfına yapılır. Bu sayfadaki araç resmî başvuru yerine geçmez.",
  },
  {
    question: "GSS gelir testi e-Devlet üzerinden yapılır mı?",
    answer:
      "Aile ve Sosyal Hizmetler Bakanlığının resmî açıklamasına göre gelir tespiti başvurusu SYD Vakfına yapılır. e-Devlet'teki Gelir Testi Sonucu Sorgulama hizmeti başvurudan sonra sonucu görüntülemek için kullanılabilir.",
  },
  {
    question: "2026 GSS gelir testi gelir sınırı nedir?",
    answer:
      "2026 brüt asgari ücret 33.030 TL'dir. GSS sınıflandırmasında kişi başına düşen gelir brüt asgari ücretin üçte birinin altında ise G0; üçte bir ve üzerinde ise G1 olarak değerlendirilir. 2026 için üçte bir referansı 11.010 TL'dir.",
  },
  {
    question: "GSS gelir testinde yalnız maaş mı dikkate alınır?",
    answer:
      "Hayır. Resmî gelir tespitinde aile bireylerinin taşınır ve taşınmazları, bunlardan doğan hak ve gelirler, giderler ve harcamalar da değerlendirmeye alınabilir. Bu nedenle basit bir maaş bölme hesabı resmî gelir testinin tamamını temsil etmez.",
  },
  {
    question: "Gelir testi sonucu nereden sorgulanır?",
    answer:
      "Gelir testi sonucu e-Devlet'teki Aile ve Sosyal Hizmetler Bakanlığı Gelir Testi Sonucu Sorgulama hizmetinden; GSS tescil ve prim borcu ise SGK'nın ilgili e-Devlet hizmetinden kontrol edilebilir.",
  },
];

const officialSources = [
  {
    label: "Aile ve Sosyal Hizmetler Bakanlığı — GSS gelir testi SSS",
    href: "https://www.aile.gov.tr/sss/sosyal-yardimlar-genel-mudurlugu/genel-saglik-sigortasi/",
  },
  {
    label: "e-Devlet — Gelir Testi Sonucu Sorgulama",
    href: "https://www.turkiye.gov.tr/ashb-gelir-testi-sonucu-sorgulama",
  },
  {
    label: "e-Devlet — GSS Tescil ve Prim Borcu Sorgulama",
    href: "https://www.turkiye.gov.tr/sgk-gss-borc-dokumu",
  },
  {
    label: "Çalışma ve Sosyal Güvenlik Bakanlığı — 2026 asgari ücret",
    href: "https://www.csgb.gov.tr/tr/poco-pages/asgari-ucret/",
  },
];

export function GssAuthorityGuide() {
  return (
    <section
      className="mx-auto mt-10 w-full max-w-6xl space-y-6 px-6 pb-14 lg:px-10"
      aria-labelledby="gss-authority-heading"
    >
      <div className="card-panel">
        <p className="eyebrow">Resmî süreç rehberi</p>
        <h2 id="gss-authority-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          GSS gelir testi: başvuru, hane hesabı ve sonuç sorgulama
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          Bu bölüm, GSS gelir testiyle ilgili en sık aranan başvuru ve gelir tespiti sorularını
          resmî kaynaklara dayanarak açıklar. Üstteki araç yalnız sınırlı bilgilerle bir ön
          değerlendirme üretir; Sosyal Yardımlaşma ve Dayanışma Vakfının yaptığı resmî gelir
          tespitinin veya SGK işleminin yerine geçmez.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="card-panel">
          <h3 className="text-xl font-semibold text-slate-950">Kimler gelir testi kapsamında değerlendirilir?</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Genel sağlık sigortalısı veya bir genel sağlık sigortalısının bakmakla yükümlü olduğu
            kişi statüsünde olmayan ya da bu statüsü sona eren Türk vatandaşları için gelir
            tespiti gündeme gelebilir. Resmî başvuru kişinin Adres Kayıt Sistemindeki ikametinin
            bulunduğu il veya ilçedeki Sosyal Yardımlaşma ve Dayanışma Vakfına yapılır.
          </p>
        </article>

        <article className="card-panel">
          <h3 className="text-xl font-semibold text-slate-950">Hanede kimlerin bilgileri dikkate alınır?</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Bakanlığın GSS açıklamasında başvuru yapan kişiyle aynı hanede yaşayan eşi, evli
            olmayan çocuğu ile anne ve babasının gelir tespitinde değerlendirildiği belirtilir.
            Aynı adreste birden fazla aile bulunması hâlinde her aile için ayrı gelir tespiti
            yapılabilen durumlar vardır. Bu nedenle “evde yaşayan herkes” ile “gelir testinde aynı
            aile biriminde değerlendirilen kişiler” her zaman aynı kavram değildir.
          </p>
        </article>
      </div>

      <article className="card-panel">
        <h3 className="text-xl font-semibold text-slate-950">2026 gelir eşiği nasıl okunmalı?</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">2026 brüt asgari ücret</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">33.030 TL</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">1/3 referansı</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">11.010 TL</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sınıflandırma</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">11.010 TL&apos;nin altı G0; 11.010 TL ve üzeri G1.</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          Bu tutar yalnız sınıflandırma eşiğinin matematiksel referansıdır. Resmî gelir testi,
          yalnız bildirilen maaşların toplanıp kişi sayısına bölünmesinden ibaret değildir.
          Taşınır ve taşınmazlar, bunlardan doğan haklar, gelir ve giderler, harcamalar ve bazı
          düzenli nakdî yardımlar da gelir tespitinde değerlendirilebilir.
        </p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950" role="note">
          <strong>Araç sınırı:</strong> Bu sayfadaki ön değerlendirme toplam brüt hane geliri, kişi
          sayısı ve sosyal güvence bilgileriyle sınırlıdır. Resmî SYD gelir tespitindeki bütün
          servet, harcama ve idari veri kontrollerini yeniden üretmez. Sonuç bu nedenle “resmî
          uygunluk kararı” olarak kullanılmamalıdır.
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="card-panel">
          <h3 className="text-xl font-semibold text-slate-950">Başvuru süresi ve geriye dönük etki</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Gelir tespiti yaptırmak isteyen re&apos;sen tescil edilmiş kişiler ilgili SYD Vakfına süre
            sınırı olmaksızın başvurabilir. Bununla birlikte SGK bildiriminin ardından bir ay
            içinde başvuru yapılması, gelir testi sonucunun primi Devlet tarafından ödenenler
            kapsamında çıkması hâlinde geriye dönük tescil etkisi açısından önem taşır.
          </p>
        </article>

        <article className="card-panel">
          <h3 className="text-xl font-semibold text-slate-950">e-Devlet&apos;te ne yapılabilir?</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Resmî gelir tespiti başvurusu SYD Vakfına yapılır. e-Devlet&apos;teki “Gelir Testi Sonucu
            Sorgulama” hizmeti sonuç kontrolü içindir. SGK&apos;nın “Genel Sağlık Sigortası Tescil ve
            Prim Borcu Sorgulama” hizmeti ise tescil ve prim borcu durumunu görüntülemek için ayrı
            bir kanaldır. Bu ayrım, “online gelir testi” ile “online sonuç sorgulama” ifadelerinin
            birbirine karıştırılmasını önler.
          </p>
        </article>
      </div>

      <article className="card-panel">
        <h3 className="text-xl font-semibold text-slate-950">Gelir testi formu hakkında</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          İnternette “gelir testi formu”, “hane beyan formu” veya “doldurulmuş gelir testi örneği”
          şeklinde aramalar yapılabiliyor. Ancak bu sayfa resmî bir form sağlamaz ve örnek bir
          formu resmî başvuru belgesi gibi sunmaz. Başvuruda istenecek beyan ve belgeler için
          ikamet yerindeki SYD Vakfının güncel yönlendirmesi esas alınmalıdır. Verilen bilgilerin
          gerçeğe uygun olması gerekir; eksik veya yanıltıcı beyan sonradan tescil ve prim
          işlemlerini etkileyebilir.
        </p>
      </article>

      <article className="card-panel">
        <h3 className="text-xl font-semibold text-slate-950">Resmî kaynaklar</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Bu rehberdeki süreç ve eşik açıklamaları aşağıdaki birincil kamu kaynaklarıyla kontrol
          edilmiştir. Başvuru öncesinde güncel uygulamayı bu kaynaklardan yeniden doğrulayın.
        </p>
        <ul className="mt-4 grid gap-3">
          {officialSources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 underline underline-offset-4"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </article>

      <article className="card-panel">
        <h3 className="text-xl font-semibold text-slate-950">Sık sorulan sorular</h3>
        <div className="mt-5 grid gap-4">
          {gssAuthorityFaq.map((item) => (
            <section key={item.question} className="rounded-2xl bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-950">{item.question}</h4>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}
