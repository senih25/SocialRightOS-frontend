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
import { buildGssPilotPresentationViewModel } from "@/lib/gss-assessment-presentation";
import { getGssResultPrimaryAction } from "@/lib/gss-explanations";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import { getToolGuidanceModel } from "@/lib/tool-guidance";
import {
  buildGssPayload,
  initialGssFormState,
  type GssFormState,
  type TriStateAttestation,
} from "@/lib/gss-form";
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
      <legend className="text-sm font-medium text-slate-900">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {triStateOptions.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={`${name}-${option.label}`}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                checked
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
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

export function GssToolPageClient() {
  const [form, setForm] = useState<GssFormState>(initialGssFormState);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [error, setError] = useState<AssessmentErrorViewModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const analyticsRef = useRef(createToolAnalyticsSession("gss"));
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
      const response = await checkEligibility(buildGssPayload(form, crypto.randomUUID()));
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
    ? buildGssPilotPresentationViewModel(
        result,
        result.request_id || result.decision_id,
      )
    : null;
  const decisionView = pilotView?.decisionView ?? null;
  const presentation = pilotView?.presentation ?? null;
  const displayStatus = presentation?.status ?? null;
  const isUnavailable = presentation?.outcome === "UNAVAILABLE";
  const displayTone = displayStatus
    ? statusTone[displayStatus]
    : "border-slate-200 bg-slate-50 text-slate-950";
  const displayStatusLabel = displayStatus ? statusLabelCopy[displayStatus] : null;
  const displayBadgeCopy = displayStatus ? statusBadgeCopy[displayStatus] : null;
  const primaryAction = displayStatus ? getGssResultPrimaryAction(displayStatus) : null;
  const guidanceModel = getToolGuidanceModel("gss");
  const grossIncomeError = findFieldError(error, "grossHouseholdIncome", "gross_household_income");
  const householdSizeError = findFieldError(error, "householdSize", "household_size");
  const socialSecurityError = findFieldError(error, "hasSocialSecurity", "has_social_security");
  const activeInsuranceError = findFieldError(error, "hasActiveInsurance", "has_active_insurance");
  const dependentCoverageError = findFieldError(error, "isCoveredAsDependent", "is_covered_as_dependent");

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="card-panel min-w-0">
          <p className="eyebrow">D-SHR Ön Değerlendirme Aracı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            GSS gelir testi için kurumsal ve açıklayıcı ön değerlendirme
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            Bu sayfa resmî karar vermez. Girdiğiniz bilgiler değerlendirilir, sonuç size sade bir
            dille gösterilir ve sonraki adım anlatılır.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            Yalnızca temel bilgiler sorulur: toplam hane geliri, hanedeki kişi sayısı ve sosyal
            güvence durumu. Emin olmadığınız sorularda Bilmiyorum seçeneğini kullanabilirsiniz.
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950" role="note">
            T.C. kimlik numarası, sağlık raporu, teşhis, belge veya başka özel nitelikli kişisel veri girmeyin.
          </div>

          <div id="form-start" className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="form-field">
              <span>Brüt toplam hane geliri (aylık)</span>
              <input
                type="number"
                id="grossHouseholdIncome"
                name="grossHouseholdIncome"
                aria-invalid={Boolean(grossIncomeError)}
                aria-describedby={grossIncomeError?.descriptionId}
                min="0"
                value={form.grossHouseholdIncome}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    grossHouseholdIncome: event.target.value,
                  }));
                }}
                placeholder="Örn. 30000"
              />
            </label>

            <label className="form-field">
              <span>Hanedeki kişi sayısı</span>
              <input
                type="number"
                id="householdSize"
                name="householdSize"
                aria-invalid={Boolean(householdSizeError)}
                aria-describedby={householdSizeError?.descriptionId}
                min="1"
                value={form.householdSize}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    householdSize: event.target.value,
                  }));
                }}
                placeholder="Örn. 3"
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Sosyal güvence durumu</p>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Bu soruları bilmiyorsanız Bilmiyorum seçeneği değerlendirme sırasında eksik bilgi
              olarak ele alınır. Sayfa sizin yerinize tahmin yürütmez.
            </p>

            <div className="mt-4 grid gap-5">
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
                legend="Aktif sigortanız var mı?"
                name="hasActiveInsurance"
                errorId={activeInsuranceError?.descriptionId}
                value={form.hasActiveInsurance}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    hasActiveInsurance: value,
                  }));
                }}
              />
              <TriStateField
                legend="Bir yakın üzerinden sağlık kapsamında mısınız?"
                name="isCoveredAsDependent"
                errorId={dependentCoverageError?.descriptionId}
                value={form.isCoveredAsDependent}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    isCoveredAsDependent: value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="primary-button"
            >
              {isSubmitting ? "Değerlendiriliyor..." : "GSS ön değerlendirmesini başlat"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialGssFormState);
                setResult(null);
                setError(null);
              }}
              disabled={isSubmitting}
              className="secondary-button"
            >
              Formu temizle
            </button>
          </div>

          {error ? <SafeErrorPanel error={error} focusRef={errorRef} /> : null}

          {result && presentation ? (
            <section
              className={`mt-6 rounded-3xl border p-6 ${displayTone}`}
              aria-live="polite"
              aria-atomic="true"
              aria-label={presentation.title}
              data-presentation-outcome={presentation.outcome}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  {displayStatusLabel ? (
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                      {displayStatusLabel}
                    </p>
                  ) : null}
                  <h2 className="mt-3 text-2xl font-semibold">
                    {decisionView?.title ?? presentation.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7">
                    {decisionView?.summary ?? presentation.summary}
                  </p>
                  {isUnavailable && presentation.disclaimer ? (
                    <p className="mt-3 max-w-2xl text-sm leading-7">
                      {presentation.disclaimer}
                    </p>
                  ) : null}
                </div>

                {displayBadgeCopy ? (
                  <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium">
                    {displayBadgeCopy}
                  </div>
                ) : null}
              </div>

              {!isUnavailable && decisionView ? (
                <>
                  <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Bu sonuç ne anlatıyor?</h3>
                  {decisionView?.primaryReason ? (
                    <ul
                      className="mt-4 space-y-3 text-sm leading-7"
                      data-presentation-section="reasons"
                    >
                      {[decisionView.primaryReason, ...decisionView.secondaryReasons].map((reason) => (
                        <li
                          key={`${reason.title}-${reason.body}`}
                          className="rounded-2xl border border-white/70 bg-white/70 p-4"
                        >
                          <span className="font-medium">{reason.title}</span>
                          <p className="mt-1">{reason.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {presentation.ruleCriteria.length > 0 ? (
                    <ul
                      className="mt-4 space-y-3 text-sm leading-7"
                      data-presentation-section="rule-criteria"
                    >
                      {presentation.ruleCriteria.map((criterion) => (
                        <li key={criterion.code} className="rounded-2xl bg-white/70 p-4">
                          {criterion.message}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {decisionView && decisionView.missingInformation.length > 0 ? (
                    <div
                      className="mt-4 rounded-2xl bg-white/70 p-4"
                      data-presentation-section="missing-information"
                    >
                      <h4 className="text-sm font-medium">Tamamlanması iyi olacak bilgiler</h4>
                      <ul className="mt-3 space-y-3 text-sm leading-7">
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
                  {decisionView ? (
                    <>
                      <h3 className="font-semibold">{decisionView.nextStepTitle}</h3>
                      <p className="mt-3 text-sm leading-7">{decisionView.nextStepBody}</p>
                    </>
                  ) : null}
                  {primaryAction ? (
                    <Link href={primaryAction.href} className="secondary-link mt-4 inline-flex">
                      {primaryAction.label}
                    </Link>
                  ) : null}

                  <div className="mt-5 flex flex-col gap-3">
                    {(decisionView?.helperLinks ?? []).map((link) => (
                      <Link key={`${link.href}-${link.label}`} href={link.href} className="secondary-link inline-flex">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                    </div>
                  </div>

                  <ToolGuidanceSurface model={guidanceModel} tool="gss" />
                </>
              ) : null}
            </section>
          ) : null}
        </section>

        <aside className="min-w-0 space-y-6">
          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Ön değerlendirme notu</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu test resmî kurum kararı yerine geçmez. Sonuç ekranı size sadece bugünkü bilgilerle
              nasıl bir yön çıktığını sade biçimde gösterir.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Bu testte hangi bilgiler sorulur?</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Brüt toplam hane geliri</li>
              <li>Hanedeki kişi sayısı</li>
              <li>Sosyal güvence durumu</li>
              <li>Aktif sigorta bilgisi</li>
              <li>Yakın üzerinden kapsam durumu</li>
            </ul>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Kısa rehberlik</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Sonuç ekranı sonrasında diğer testlere dönebilir veya ana sayfadan size daha uygun
              olabilecek aracı seçebilirsiniz.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/" className="secondary-link inline-flex">
                Tüm testlere dön
              </Link>
              <Link href="/evde-bakim-maasi" className="secondary-link inline-flex">
                Örnek canlı rehber akışını gör
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
