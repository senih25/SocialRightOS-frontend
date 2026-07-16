"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToolGuidanceSurface } from "@/components/ToolGuidanceSurface";
import { SafeErrorPanel } from "@/components/ui/SafeErrorPanel";
import { checkEligibility } from "@/lib/api";
import {
  buildAssessmentErrorViewModel,
  findFieldError,
  type AssessmentErrorViewModel,
} from "@/lib/assessment-error";
import { buildOldAgePilotPresentationViewModel } from "@/lib/old-age-assessment-presentation";
import { getOldAgeResultPrimaryAction } from "@/lib/old-age-explanations";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import { getToolGuidanceModel } from "@/lib/tool-guidance";
import {
  buildOldAgePayload,
  initialOldAgeFormState,
  type OldAgeFormState,
  type TriStateAttestation,
} from "@/lib/old-age-form";
import type { EligibilityCheckResponse, EligibilityStatus } from "@/lib/types";

const statusTone: Record<EligibilityStatus, string> = {
  ELIGIBLE: "border-emerald-200 bg-emerald-50 text-emerald-950",
  NOT_ELIGIBLE: "border-rose-200 bg-rose-50 text-rose-950",
  NEEDS_INFO: "border-amber-200 bg-amber-50 text-amber-950",
};

const statusBadgeCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Ön değerlendirme olumlu",
  NOT_ELIGIBLE: "Bilgileri yeniden kontrol edin",
  NEEDS_INFO: "Eksik bilgi tamamlanmalı",
};

const statusLabelCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Uygun görünüyor",
  NOT_ELIGIBLE: "Uygun görünmüyor",
  NEEDS_INFO: "Ek bilgi gerekli",
};

const triStateOptions: Array<{ label: string; value: TriStateAttestation }> = [
  { label: "Evet", value: true },
  { label: "Hayır", value: false },
  { label: "Bilmiyorum", value: null },
];

type TriStateFieldProps = {
  legend: string;
  name: string;
  value: TriStateAttestation;
  onChange: (value: TriStateAttestation) => void;
  errorId?: string;
};

function TriStateField({ legend, name, value, onChange, errorId }: TriStateFieldProps) {
  return (
    <fieldset aria-invalid={Boolean(errorId)} aria-describedby={errorId}>
      <legend className="text-base font-semibold text-slate-950">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {triStateOptions.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={`${name}-${option.label}`}
              className={`inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border px-4 py-3 text-base transition ${
                checked
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function OldAgeToolPageClient() {
  const [form, setForm] = useState<OldAgeFormState>(initialOldAgeFormState);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [error, setError] = useState<AssessmentErrorViewModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const analyticsRef = useRef(createToolAnalyticsSession("old-age"));
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analyticsRef.current.trackOpened();
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    analyticsRef.current.trackResultReceived(result.decision_id, result.status);
  }, [result]);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const markFormStarted = () => {
    analyticsRef.current.trackFormStarted();
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    analyticsRef.current.trackFormSubmitted();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await checkEligibility(buildOldAgePayload(form, crypto.randomUUID()));
      setResult(response);
    } catch (err) {
      const safeError = buildAssessmentErrorViewModel(err);
      setError(safeError);
      if (safeError.kind === "VALIDATION") {
        analyticsRef.current.trackValidationFailed();
      } else {
        analyticsRef.current.trackApiFailed();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const pilotView = result
    ? buildOldAgePilotPresentationViewModel(
        result,
        result.request_id || result.decision_id,
      )
    : null;
  const presentation = pilotView?.presentation ?? null;
  const decisionView = pilotView?.decisionView ?? null;
  const displayStatus = presentation?.status ?? null;
  const isUnavailable = presentation?.outcome === "UNAVAILABLE";
  const resultTone = displayStatus
    ? statusTone[displayStatus]
    : "border-slate-200 bg-slate-50 text-slate-950";
  const primaryAction = displayStatus ? getOldAgeResultPrimaryAction(displayStatus) : null;
  const guidanceModel = getToolGuidanceModel("old-age");
  const ageError = findFieldError(error, "age");
  const spouseError = findFieldError(error, "hasSpouse", "has_spouse");
  const selfIncomeError = findFieldError(error, "selfMonthlyIncome", "self_monthly_income");
  const spouseIncomeError = findFieldError(error, "spouseMonthlyIncome", "spouse_monthly_income");
  const socialSecurityError = findFieldError(error, "hasSocialSecurity", "has_social_security");
  const pensionError = findFieldError(error, "receivesPension", "receives_pension");

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="card-panel">
          <p className="eyebrow">D-SHR Ön Değerlendirme Aracı</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            65 yaş aylığı için kurumsal ve okunması kolay ön değerlendirme
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-700">
            Bu araç resmî karar vermez. Yaş, gelir ve sosyal güvence bilgilerinizle ön
            değerlendirme sunar ve bir sonraki adımı açıklar.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-base leading-8 text-slate-700">
            Form olabildiğince kısa tutuldu. Yazılar daha büyük, seçimler daha net ve butonlar
            daha belirgindir. Emin olmadığınız sorularda Bilmiyorum seçeneğini kullanabilirsiniz.
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base leading-8 text-amber-950" role="note">
            T.C. kimlik numarası, sağlık raporu, teşhis, belge veya başka özel nitelikli kişisel veri girmeyin.
          </div>

          <div id="form-start" className="mt-8 grid gap-6">
            <label className="form-field text-lg">
              <span>Yaşınız</span>
              <input
                className="min-h-14 text-lg"
                type="number"
                id="age"
                name="age"
                aria-invalid={Boolean(ageError)}
                aria-describedby={ageError?.descriptionId}
                min="0"
                max="120"
                value={form.age}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    age: event.target.value,
                  }));
                }}
                placeholder="Örn. 67"
              />
            </label>

            <TriStateField
              legend="Eşiniz var mı?"
              name="hasSpouse"
              errorId={spouseError?.descriptionId}
              value={form.hasSpouse}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  hasSpouse: value,
                }));
              }}
            />

            <label className="form-field text-lg">
              <span>Sizin aylık geliriniz</span>
              <input
                className="min-h-14 text-lg"
                type="number"
                id="selfMonthlyIncome"
                name="selfMonthlyIncome"
                aria-invalid={Boolean(selfIncomeError)}
                aria-describedby={selfIncomeError?.descriptionId}
                min="0"
                value={form.selfMonthlyIncome}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    selfMonthlyIncome: event.target.value,
                  }));
                }}
                placeholder="Örn. 5000"
              />
            </label>

            {form.hasSpouse === true ? (
              <label className="form-field text-lg">
                <span>Eşinizin aylık geliri</span>
                <input
                  className="min-h-14 text-lg"
                  type="number"
                  id="spouseMonthlyIncome"
                  name="spouseMonthlyIncome"
                  aria-invalid={Boolean(spouseIncomeError)}
                  aria-describedby={spouseIncomeError?.descriptionId}
                  min="0"
                  value={form.spouseMonthlyIncome}
                  onChange={(event) => {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      spouseMonthlyIncome: event.target.value,
                    }));
                  }}
                  placeholder="Örn. 6000"
                />
              </label>
            ) : null}

            <TriStateField
              legend="Herhangi bir sosyal güvenceniz var mı?"
              name="hasSocialSecurity"
              errorId={socialSecurityError?.descriptionId}
              value={form.hasSocialSecurity}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  hasSocialSecurity: value,
                }));
              }}
            />

            <TriStateField
              legend="Hâlen emekli aylığı alıyor musunuz?"
              name="receivesPension"
              errorId={pensionError?.descriptionId}
              value={form.receivesPension}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  receivesPension: value,
                }));
              }}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="primary-button text-lg"
            >
              {isSubmitting ? "Değerlendiriliyor..." : "65 yaş aylığı testini çalıştır"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialOldAgeFormState);
                setResult(null);
                setError(null);
              }}
              disabled={isSubmitting}
              className="secondary-button text-lg"
            >
              Formu temizle
            </button>
          </div>

          {error ? <SafeErrorPanel error={error} focusRef={errorRef} /> : null}

          {result && presentation ? (
            <section
              className={`mt-6 rounded-3xl border p-6 ${resultTone}`}
              aria-live="polite"
              aria-atomic="true"
              aria-label={presentation.title}
              data-presentation-outcome={presentation.outcome}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  {displayStatus ? (
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                      {statusLabelCopy[displayStatus]}
                    </p>
                  ) : null}
                  <h2 className="mt-3 text-3xl font-semibold">
                    {decisionView?.title ?? presentation.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8">
                    {decisionView?.summary ?? presentation.summary}
                  </p>
                  {isUnavailable && presentation.disclaimer ? (
                    <p className="mt-3 max-w-2xl text-base leading-8">
                      {presentation.disclaimer}
                    </p>
                  ) : null}
                </div>

                {displayStatus ? (
                  <div className="rounded-2xl bg-white/80 px-4 py-3 text-base font-medium">
                    {statusBadgeCopy[displayStatus]}
                  </div>
                ) : null}
              </div>

              {!isUnavailable && decisionView ? (
              <>
              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="text-lg font-semibold">Bu sonuç ne anlatıyor?</h3>
                  {decisionView.primaryReason ? (
                    <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4" data-presentation-section="reasons">
                      <p className="text-base font-medium">{decisionView.primaryReason.title}</p>
                      <p className="mt-2 text-base leading-8">{decisionView.primaryReason.body}</p>
                    </div>
                  ) : null}

                  {decisionView.secondaryReasons.length > 0 ? (
                    <ul className="mt-4 space-y-3 text-base leading-8">
                      {decisionView.secondaryReasons.map((reason) => (
                        <li key={`${reason.title}-${reason.body}`} className="rounded-2xl bg-white/70 p-4">
                          <span className="font-medium">{reason.title}</span>
                          <p className="mt-1">{reason.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {presentation.ruleCriteria.length > 0 ? (
                    <ul className="mt-4 space-y-3 text-base leading-8" data-presentation-section="rule-criteria">
                      {presentation.ruleCriteria.map((criterion) => (
                        <li key={criterion.code} className="rounded-2xl bg-white/70 p-4">
                          {criterion.message}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {decisionView.missingInformation.length > 0 ? (
                    <div className="mt-4 rounded-2xl bg-white/70 p-4" data-presentation-section="missing-information">
                      <h4 className="text-base font-medium">Tamamlanması iyi olacak bilgiler</h4>
                      <ul className="mt-3 space-y-3 text-base leading-8">
                        {decisionView.missingInformation.map((fact) => (
                          <li key={`${fact.title}-${fact.body}`}>
                            <span className="font-medium">{fact.title}</span>
                            <p className="mt-1">{fact.body}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="text-lg font-semibold">{decisionView.nextStepTitle}</h3>
                  <p className="mt-3 text-base leading-8">{decisionView.nextStepBody}</p>
                  {primaryAction ? (
                    <Link href={primaryAction.href} className="secondary-link mt-4 inline-flex text-base">
                      {primaryAction.label}
                    </Link>
                  ) : null}

                  <div className="mt-5 flex flex-col gap-3">
                    {decisionView.helperLinks.map((link) => (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        className="secondary-link inline-flex text-base"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <ToolGuidanceSurface model={guidanceModel} tool="old-age" />
              </>
              ) : null}
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Ön değerlendirme notu</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">
              Bu test resmî kurum kararı yerine geçmez. Sonuç ekranı size şimdi ne yapmanızın iyi
              olacağını gösteren bir rehberdir.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Kısa hazırlık listesi</h2>
            <ul className="mt-3 space-y-3 text-base leading-8 text-slate-700">
              <li>Yaşınızı doğru girin.</li>
              <li>Varsa eş gelirini atlamayın.</li>
              <li>Sosyal güvence ve emekli aylığı bilgisini netleştirin.</li>
            </ul>
          </div>

          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Sonra nereye gitmeli?</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/" className="secondary-link inline-flex text-base">
              Diğer ön değerlendirmelere dön
              </Link>
              <Link href="/gss-gelir-testi" className="secondary-link inline-flex text-base">
                GSS testini de gör
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
