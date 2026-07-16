import type { Metadata } from "next";
import Link from "next/link";
import { LegalReviewNotice } from "@/components/ui/LegalReviewNotice";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "Dijital Sosyal Hak Rehberi kullanım sınırları ve kullanıcı sorumlulukları.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">Kullanım koşulları</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Ön değerlendirme ve sorumluluk sınırı</h1>
          <p className="mt-5 text-base leading-8 text-slate-700">Siteyi kullanmanız, bu aracın bir kamu kurumu veya resmî başvuru kanalı olmadığını kabul ettiğiniz anlamına gelir.</p>
        </section>
        <LegalReviewNotice />
        <section className="card-panel space-y-6 text-base leading-8 text-slate-700">
          <div><h2 className="text-2xl font-semibold text-slate-950">Kararın niteliği</h2><p className="mt-3">Sonuç kesin hak sahipliği, hukuki görüş veya resmî kurum kararı değildir. Nihai kararı ilgili kamu kurumu güncel mevzuat ve belgeler üzerinden verir.</p></div>
          <div><h2 className="text-2xl font-semibold text-slate-950">Kullanıcı sorumluluğu</h2><p className="mt-3">Bilgilerinizi kontrol edin, mevzuatın değişebileceğini dikkate alın ve başvuru öncesinde resmî kanalları doğrulayın. Özel nitelikli kişisel veri girmeyin.</p></div>
          <div><h2 className="text-2xl font-semibold text-slate-950">Kullanılabilirlik</h2><p className="mt-3">Beta döneminde hizmet geçici olarak kesilebilir veya desteklenmeyen durumlarda fail-closed sonuç verebilir. Bu durum olumlu ya da olumsuz uygunluk kararı sayılmaz.</p></div>
          <Link href="/kaynak-ve-guncellik-politikasi" className="secondary-link inline-flex">Kaynak ve güncellik politikasını oku</Link>
        </section>
      </div>
    </main>
  );
}
