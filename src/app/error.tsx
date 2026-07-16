"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    document.querySelector<HTMLElement>("[data-global-error]")?.focus();
  }, []);

  return (
    <main className="min-h-screen px-6 py-16">
      <section
        className="card-panel mx-auto max-w-2xl outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
        data-global-error
      >
        <p className="eyebrow">Güvenli hata durumu</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Sayfa şu anda gösterilemiyor</h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Teknik ayrıntılar paylaşılmadı. Bir süre sonra yeniden deneyebilir veya ana sayfaya dönebilirsiniz.
        </p>
        <button type="button" className="primary-button mt-6" onClick={reset}>
          Yeniden dene
        </button>
      </section>
    </main>
  );
}
