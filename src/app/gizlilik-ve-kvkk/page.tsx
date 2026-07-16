import type { Metadata } from "next";
import Link from "next/link";
import { LegalReviewNotice } from "@/components/ui/LegalReviewNotice";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Bilgilendirmesi",
  description: "Dijital Sosyal Hak Rehberi veri minimizasyonu, kullanım ve gizlilik sınırları.",
  alternates: { canonical: "/gizlilik-ve-kvkk" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">Gizlilik ve KVKK</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Veri minimizasyonu ve güvenli kullanım</h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Bu araçlar kaynak temelli ön değerlendirme sunar; resmî kurum değildir ve kesin hak sahipliği kararı vermez.
          </p>
        </section>
        <LegalReviewNotice />
        <section className="card-panel space-y-6 text-base leading-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Hangi bilgiler kullanılır?</h2>
            <p className="mt-3">Yalnız seçtiğiniz testin hesaplanması için gerekli, sınırlı form cevapları işlenir. Ad, soyad, T.C. kimlik numarası, açık adres, telefon veya sağlık belgesi istenmez.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Özel nitelikli veri girmeyin</h2>
            <p className="mt-3">Sağlık raporu, teşhis, biyometrik veri, kimlik belgesi, gelir belgesi veya başka özel nitelikli kişisel veri paylaşmayın.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Saklama ve paylaşım sınırı</h2>
            <p className="mt-3">Kontrollü beta için kalıcı form cevabı saklama veya üçüncü taraf reklam profillemesi planlanmamıştır. Teknik ölçüm etkinleştirilirse yalnız minimizasyonlu olay adları kullanılmalıdır.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Haklar ve iletişim</h2>
            <p className="mt-3">Gizlilik sorusu veya düzeltme talebi için kişisel belge eklemeden iletişim kanalını kullanın.</p>
            <Link href="/iletisim" className="secondary-link mt-4 inline-flex">İletişim ve geri bildirim</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
