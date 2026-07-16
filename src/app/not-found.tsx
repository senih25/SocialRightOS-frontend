import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="card-panel mx-auto max-w-2xl">
        <p className="eyebrow">Sayfa bulunamadı</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Bu içerik kullanılamıyor</h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Aradığınız sayfa kaldırılmış, taşınmış veya desteklenmiyor olabilir.
        </p>
        <Link href="/" className="primary-link mt-6">Ana sayfaya dön</Link>
      </section>
    </main>
  );
}
