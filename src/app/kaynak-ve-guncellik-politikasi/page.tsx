import type { Metadata } from "next";
import Link from "next/link";
import { LegalReviewNotice } from "@/components/ui/LegalReviewNotice";

export const metadata: Metadata = {
  title: "Kaynak ve Güncellik Politikası",
  description: "Sosyal hak bilgilerinin kaynak seçimi, sürüm ve güncellik doğrulama yaklaşımı.",
  alternates: { canonical: "/kaynak-ve-guncellik-politikasi" },
};

export default function SourcePolicyPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">Kaynak ve güncellik</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Doğrulanabilir kaynak, açık tarih ve sürüm</h1>
          <p className="mt-5 text-base leading-8 text-slate-700">İçerik ve ön değerlendirme kuralları, mümkün olduğunda resmî birincil kaynaklara ve açık güncellik bilgisine dayanır.</p>
        </section>
        <LegalReviewNotice />
        <section className="card-panel space-y-6 text-base leading-8 text-slate-700">
          <div><h2 className="text-2xl font-semibold text-slate-950">Kaynak önceliği</h2><p className="mt-3">Kanun ve yönetmelikler, Resmî Gazete, ilgili bakanlıklar, SGK, e-Devlet ve yetkili kamu kurumlarının yayımladığı birincil bilgiler önceliklidir.</p></div>
          <div><h2 className="text-2xl font-semibold text-slate-950">Güncellik</h2><p className="mt-3">Mevzuat, tutarlar ve başvuru kanalları değişebilir. Sonuç ekranındaki geçerlilik tarihi ve politika/sürüm bilgisi mevcutsa ayrı gösterilir; eksikse kullanıcı resmî kaynağa yönlendirilir.</p></div>
          <div><h2 className="text-2xl font-semibold text-slate-950">Çelişki ve düzeltme</h2><p className="mt-3">Kaynaklar çelişirse otomatik kesinleştirme yapılmaz; insan incelemesi gerekir. Hatalı veya güncelliğini yitirmiş bilgi geri bildirimle bildirilebilir.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/methodology" className="secondary-link inline-flex">Yöntem ve sınırlar</Link><Link href="/iletisim" className="secondary-link inline-flex">Düzeltme bildir</Link></div>
        </section>
      </div>
    </main>
  );
}
