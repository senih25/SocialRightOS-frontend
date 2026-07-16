export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-16" aria-busy="true" aria-live="polite">
      <div className="card-panel mx-auto max-w-2xl">
        <p className="eyebrow">Yükleniyor</p>
        <p className="mt-4 text-lg text-slate-700">İçerik güvenli biçimde hazırlanıyor…</p>
      </div>
    </main>
  );
}
