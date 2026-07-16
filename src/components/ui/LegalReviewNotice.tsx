export function LegalReviewNotice() {
  return (
    <aside
      className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950"
      role="note"
      aria-label="Hukuk incelemesi durumu"
      data-legal-review="required"
    >
      <strong>HUMAN_LEGAL_REVIEW_REQUIRED:</strong> Bu bilgilendirme metni kontrollü beta öncesinde
      yetkili bir hukuk uzmanı tarafından incelenmelidir.
    </aside>
  );
}
