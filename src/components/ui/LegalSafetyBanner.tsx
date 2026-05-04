// Sunucu Bileşeni — tüm hesaplama/rehber sayfalarına dahil edilebilir.
// Bu bildirimi gören kullanıcı, sistemin ön değerlendirme olduğunu açıkça anlar.
export default function LegalSafetyBanner() {
  return (
    <div
      role="note"
      aria-label="Hukuki Güvenlik Bildirimi"
      className="legal-safety-banner"
    >
      <span className="legal-safety-icon" aria-hidden="true">⚖️</span>
      <div>
        <p className="legal-safety-title">Hukuki Güvenlik Bildirimi</p>
        <p className="legal-safety-body">
          <strong>D-SHR</strong>, yalnızca ön değerlendirme ve rehberlik amacıyla
          tasarlanmıştır. Sunulan sonuçlar bir simülasyondur; resmî idari karar
          niteliği taşımaz. Kesin kararlar yalnızca yetkili kamu kurumları
          (SGK, Sosyal Yardım ve Dayanışma Vakıfları, ÇSGB vb.) tarafından verilir.
          Başvuru için lütfen ilgili kuruma danışınız.
        </p>
      </div>
    </div>
  );
}
