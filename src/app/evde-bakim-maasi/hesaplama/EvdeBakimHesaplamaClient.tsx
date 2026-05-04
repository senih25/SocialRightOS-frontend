"use client";

// İstemci bileşeni: form state, hesaplama mantığı ve speechSynthesis API'si.
// Statik içerik (metadata, JSON-LD, LegalSafetyBanner) page.tsx'te tutulur.
import { useState } from "react";
import Link from "next/link";
import VoiceGuide from "@/components/ui/VoiceGuide";
import DataShieldBadge from "@/components/ui/DataShieldBadge";

type TriState = boolean | null;
type EligibilityStatus = "ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_INFO";

const VOICE_TEXT =
  "Evde Bakım Maaşı Uygunluk Testi. İkamet, sağlık raporu ve hane geliri " +
  "bilgilerinizi girerek analizinizi başlatın. TC Kimlik numaranız istenmez.";

const STATUS_CONFIG: Record<
  EligibilityStatus,
  { colorClass: string; label: string; badge: string }
> = {
  ELIGIBLE: {
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
    label: "Şartlarınız Uygun Görünüyor",
    badge: "Hazırlıkla devam edebilirsiniz",
  },
  NOT_ELIGIBLE: {
    colorClass: "border-rose-200 bg-rose-50 text-rose-950",
    label: "Şartlarınız Uygun Görünmüyor",
    badge: "Bilgileri yeniden gözden geçirin",
  },
  NEEDS_INFO: {
    colorClass: "border-amber-200 bg-amber-50 text-amber-950",
    label: "Ek Bilgi Gerekiyor",
    badge: "Eksik bilgi tamamlanmalı",
  },
};

// ─── TriStateField: WCAG 2.1 AA uyumlu Evet/Hayır/Bilmiyorum radio grubu ────
function TriStateField({
  legend,
  name,
  value,
  onChange,
  hint,
}: {
  legend: string;
  name: string;
  value: TriState;
  onChange: (v: TriState) => void;
  hint?: string;
}) {
  const options: Array<{ label: string; val: TriState }> = [
    { label: "Evet", val: true },
    { label: "Hayır", val: false },
    { label: "Bilmiyorum", val: null },
  ];

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold text-slate-900 leading-6">
        {legend}
      </legend>
      {hint && (
        <p className="text-xs text-slate-500 leading-5" aria-live="polite">
          {hint}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={`${name}-${opt.label}`}
            className={
              "inline-flex min-h-[3rem] min-w-[6.5rem] cursor-pointer items-center " +
              "justify-center gap-2 rounded-2xl border-2 px-5 py-3 text-sm font-bold " +
              "transition-all active:scale-95 " +
              (value === opt.val
                ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-lg"
                : "border-slate-200 bg-white text-slate-600 hover:border-[var(--accent)]")
            }
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              checked={value === opt.val}
              onChange={() => onChange(opt.val)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// ─── Bölüm başlığı: numaralı badge ile görsel hiyerarşi ─────────────────────
function SectionTitle({ num, children }: { num: string; children: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900">
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-black"
        aria-hidden="true"
      >
        {num}
      </span>
      {children}
    </h2>
  );
}

export default function EvdeBakimHesaplamaClient() {
  const [form, setForm] = useState({
    isResidentInTr: null as TriState,
    isTurkishCitizen: null as TriState,
    disabilityRate: "",
    isFullyDependent: null as TriState,
    householdSize: "1",
    householdIncome: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    status: EligibilityStatus;
    reasons: string[];
  } | null>(null);

  const handleCalculate = async () => {
    if (!form.disabilityRate || !form.householdIncome) return;
    setIsSubmitting(true);
    setResult(null);

    // Deterministic yerel simülasyon — backend gerektirmez
    await new Promise((r) => setTimeout(r, 900));

    const rate = parseInt(form.disabilityRate, 10);
    const income =
      parseInt(form.householdIncome, 10) /
      Math.max(1, parseInt(form.householdSize, 10));
    const incomeLimit = 11334; // 2025 tahmini eşik (asgari ücretin 2/3'ü)

    let status: EligibilityStatus = "ELIGIBLE";
    const reasons: string[] = [];

    if (rate < 50) {
      status = "NOT_ELIGIBLE";
      reasons.push(
        "Engel oranınız %50 sınırının altında kaldığı için mevzuat uygunluğu sağlanamadı."
      );
    }
    if (form.isFullyDependent === false) {
      status = "NOT_ELIGIBLE";
      reasons.push(
        "Raporunuzda 'Tam Bağımlı' ibaresi bulunmadığı için kriter dışı kalmaktasınız."
      );
    }
    if (income > incomeLimit) {
      status = "NOT_ELIGIBLE";
      reasons.push(
        "Hane başına düşen aylık net gelir, yasal sınırı (asgari ücretin 2/3'ü) aşmaktadır."
      );
    }
    if (form.isFullyDependent === null && status === "ELIGIBLE") {
      status = "NEEDS_INFO";
      reasons.push(
        "Tam bağımlılık ibaresi seçilmediği için değerlendirme netleştirilemedi."
      );
    }
    if (reasons.length === 0) {
      reasons.push(
        "Girdiğiniz kriterler 2025 mevzuat şartlarını karşılamaktadır."
      );
    }

    setResult({ status, reasons });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setForm({
      isResidentInTr: null,
      isTurkishCitizen: null,
      disabilityRate: "",
      isFullyDependent: null,
      householdSize: "1",
      householdIncome: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="section-shell">
        {/* Sesli Rehber — istemci adası */}
        <div className="flex justify-end pt-4 pb-2">
          <VoiceGuide text={VOICE_TEXT} label="Hesaplama sayfasını sesli dinle" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ─── Sol Kolon: Form ─────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Sayfa Başlığı */}
            <div className="panel-strong space-y-4">
              <p className="eyebrow">D-SHR — Ön Değerlendirme Aracı</p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-tight">
                Evde Bakım Maaşı{" "}
                <span className="text-[var(--accent)]">Uygunluk Testi</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                TC Kimlik numaranız istenmez. Mevzuat uygunluğunuzu anonim ve
                güvenli biçimde saniyeler içinde sorgulayın.
              </p>
            </div>

            {/* Form */}
            <form
              id="evde-bakim-form"
              className="panel-strong space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                handleCalculate();
              }}
              noValidate
              aria-label="Evde bakım maaşı uygunluk testi formu"
            >
              {/* Bölüm 01: İkamet ve Kimlik */}
              <div className="space-y-6">
                <SectionTitle num="01">İkamet ve Kimlik</SectionTitle>
                <div className="grid gap-6 md:grid-cols-2">
                  <TriStateField
                    legend="Türkiye'de mi ikamet ediyorsunuz?"
                    name="residence"
                    value={form.isResidentInTr}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, isResidentInTr: v }))
                    }
                  />
                  <TriStateField
                    legend="T.C. Vatandaşı mısınız?"
                    name="citizenship"
                    value={form.isTurkishCitizen}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, isTurkishCitizen: v }))
                    }
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Bölüm 02: Sağlık ve Rapor */}
              <div className="space-y-6">
                <SectionTitle num="02">Sağlık ve Rapor Bilgileri</SectionTitle>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="form-field">
                    <label
                      htmlFor="disability-rate"
                      className="text-sm font-bold text-slate-900"
                    >
                      Engel Rapor Oranı (%)
                    </label>
                    <input
                      id="disability-rate"
                      type="number"
                      min="0"
                      max="100"
                      className="min-h-[3.25rem] text-base"
                      placeholder="Örn: 80"
                      value={form.disabilityRate}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          disabilityRate: e.target.value,
                        }))
                      }
                      aria-describedby="disability-rate-hint"
                    />
                    <p
                      id="disability-rate-hint"
                      className="text-xs text-slate-500"
                    >
                      Sağlık kurulunun belirlediği oran. En az %50 olmalıdır.
                    </p>
                  </div>
                  <TriStateField
                    legend="Raporunuzda 'Tam Bağımlı' ibaresi var mı?"
                    name="fully-dependent"
                    value={form.isFullyDependent}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, isFullyDependent: v }))
                    }
                    hint="'Tam Bağımlı' veya 'Ağır Engellilik' ibaresi zorunludur."
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Bölüm 03: Hane ve Gelir */}
              <div className="space-y-6">
                <SectionTitle num="03">Hane ve Gelir Bilgisi</SectionTitle>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="form-field">
                    <label
                      htmlFor="household-size"
                      className="text-sm font-bold text-slate-900"
                    >
                      Hanedeki Toplam Kişi Sayısı
                    </label>
                    <input
                      id="household-size"
                      type="number"
                      min="1"
                      className="min-h-[3.25rem] text-base"
                      value={form.householdSize}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, householdSize: e.target.value }))
                      }
                      aria-describedby="household-size-hint"
                    />
                    <p
                      id="household-size-hint"
                      className="text-xs text-slate-500"
                    >
                      Aynı adreste yaşayan toplam kişi sayısı.
                    </p>
                  </div>
                  <div className="form-field">
                    <label
                      htmlFor="household-income"
                      className="text-sm font-bold text-slate-900"
                    >
                      Toplam Aylık Net Gelir (TL)
                    </label>
                    <input
                      id="household-income"
                      type="number"
                      min="0"
                      className="min-h-[3.25rem] text-base"
                      placeholder="Örn: 15000"
                      value={form.householdIncome}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          householdIncome: e.target.value,
                        }))
                      }
                      aria-describedby="household-income-hint"
                    />
                    <p
                      id="household-income-hint"
                      className="text-xs text-slate-500"
                    >
                      Tüm hane bireylerinin toplam aylık net geliri.
                    </p>
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !form.disabilityRate ||
                    !form.householdIncome
                  }
                  className={
                    "flex flex-1 items-center justify-center gap-2 rounded-2xl py-5 " +
                    "text-lg font-black text-white shadow-xl transition-all " +
                    "bg-[var(--action)] hover:bg-orange-600 active:scale-95 " +
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  }
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Hesaplanıyor..." : "Uygunluk Testini Çalıştır →"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl border-2 border-slate-100 px-8 py-5 font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Formu Sıfırla
                </button>
              </div>
            </form>

            {/* ─── Sonuç Alanı ─────────────────────────────────────────── */}
            {result && (
              <section
                aria-live="polite"
                aria-label="Uygunluk analizi sonucu"
                className={`rounded-[2rem] border-2 p-8 lg:p-12 ${STATUS_CONFIG[result.status].colorClass}`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">
                      D-SHR Sistem Çıktısı
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                      {STATUS_CONFIG[result.status].label}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-white/40 px-6 py-3 text-sm font-bold uppercase tracking-widest backdrop-blur-sm">
                    {STATUS_CONFIG[result.status].badge}
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-white/60 p-6">
                    <h3 className="font-black text-slate-900 mb-4">
                      Değerlendirme Detayları
                    </h3>
                    <ul className="space-y-3 text-sm font-medium text-slate-700">
                      {result.reasons.map((r, i) => (
                        <li key={i} className="flex gap-3">
                          <span
                            className="text-[var(--accent)] font-bold flex-shrink-0"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-900 p-6 text-white">
                    <h3 className="font-bold mb-3">Resmî Yol Haritası</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">
                      Ön değerlendirme olumlu olsa dahi, belgelerinizle en yakın
                    Sosyal Hizmet Merkezi&apos;ne müracaat etmelisiniz.
                    </p>
                    <Link
                      href="/evde-bakim-maasi/basvuru-rehberi"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-4 font-black text-white hover:bg-[var(--accent-deep)] transition-colors"
                    >
                      📋 Başvuru Rehberine Git
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ─── Sağ Kolon: Bilgi Paneli ─────────────────────────────────── */}
          <aside
            className="space-y-6"
            aria-label="Gizlilik ve kriter bilgileri"
          >
            <div className="sticky top-28 space-y-6">
              <DataShieldBadge />

              <div className="panel-strong">
                <h2 className="text-base font-bold text-slate-950 mb-4">
                  Kriter Özeti
                </h2>
                <ul className="space-y-3 text-sm font-semibold text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]" aria-hidden="true">1.</span>
                    Engel oranı en az %50 ve rapor &ldquo;Tam Bağımlı&rdquo; olmalıdır.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]" aria-hidden="true">2.</span>
                    Kişi başı gelir asgari ücretin 2/3&apos;ünden az olmalıdır.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]" aria-hidden="true">3.</span>
                    Bakım veren ile alan aynı adreste ikamet etmelidir.
                  </li>
                </ul>
              </div>

              <div className="panel">
                <h2 className="text-sm font-bold text-slate-950 mb-3">
                  Sonraki Adımlar
                </h2>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/evde-bakim-maasi/sartlar"
                    className="secondary-link compact-link text-sm"
                  >
                    Tüm Şartları Gör
                  </Link>
                  <Link
                    href="/evde-bakim-maasi/basvuru-rehberi"
                    className="secondary-link compact-link text-sm"
                  >
                    Başvuru Rehberi
                  </Link>
                  <Link href="/" className="secondary-link compact-link text-sm">
                    Diğer Testler
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
