"use client";

import { useEffect, useRef, useState } from "react";
import { requestSyntheticBuildWeekGuidance } from "@/lib/build-week-guidance-client";
import type { RightsGuidanceExplanation } from "@/lib/rights-guidance";

type PanelState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "AVAILABLE"; guidance: RightsGuidanceExplanation }
  | { status: "UNAVAILABLE" };

export function BuildWeekGuidancePanel() {
  const [state, setState] = useState<PanelState>({ status: "IDLE" });
  const nonceRef = useRef<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "AVAILABLE" || state.status === "UNAVAILABLE") {
      statusRef.current?.focus();
    }
  }, [state.status]);

  const generate = async () => {
    if (state.status !== "IDLE") return;
    setState({ status: "LOADING" });
    nonceRef.current ??= crypto.randomUUID();
    const guidance = await requestSyntheticBuildWeekGuidance(nonceRef.current);
    setState(
      guidance.overallStatus === "EXPLANATION_AVAILABLE"
        ? { status: "AVAILABLE", guidance }
        : { status: "UNAVAILABLE" },
    );
  };

  const isLoading = state.status === "LOADING";

  return (
    <section
      id="build-week-guidance"
      className="mt-6 scroll-mt-64 overflow-hidden rounded-3xl border border-teal-200 bg-white shadow-sm"
      aria-labelledby="build-week-guidance-title"
      data-build-week-guidance-state={state.status}
    >
      <div className="border-b border-teal-100 bg-teal-50/70 px-5 py-4 sm:px-6">
        <h2 id="build-week-guidance-title" className="text-lg font-semibold text-slate-950">
          Kanıta bağlı yapay zekâ açıklaması
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
          Bu Build Week demosu yalnız sabit sentetik kanıtları kullanır. Form yanıtlarınız ve
          ön değerlendirme sonucunuz yapay zekâ modeline gönderilmez.
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {state.status === "IDLE" || state.status === "LOADING" ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              GPT-5.6 yalnız onaylı kanıt metinlerini sadeleştirir; uygunluk sonucu üretemez veya
              mevcut sonucu değiştiremez.
            </p>
            <button
              type="button"
              className="secondary-button shrink-0"
              onClick={generate}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Sentetik açıklama hazırlanıyor…" : "Sentetik açıklamayı oluştur"}
            </button>
          </div>
        ) : null}

        <div
          ref={statusRef}
          tabIndex={state.status === "AVAILABLE" || state.status === "UNAVAILABLE" ? -1 : undefined}
          className={
            state.status === "IDLE"
              ? "sr-only"
              : "rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4"
          }
          aria-live="polite"
          aria-atomic="true"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <p className="sr-only">Sentetik açıklama hazırlanıyor…</p>
          ) : null}

          {state.status === "UNAVAILABLE" ? (
            <div role="status">
              <h3 className="font-semibold text-slate-950">Açıklama şu anda kullanılamıyor</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Ön değerlendirme sonucunuz değişmedi. Harcama güvenliği için bu oturumda yeniden
                deneme yapılmayacak.
              </p>
            </div>
          ) : null}

          {state.status === "AVAILABLE" ? (
            <div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-slate-950">Gerekçe açıklaması</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                    {state.guidance.reasonExplanations.map((item) => (
                      <li key={item.evidenceId}>{item.plainLanguageText}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-950">Sonraki adım açıklaması</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                    {state.guidance.nextStepExplanations.map((item) => (
                      <li key={item.evidenceId}>{item.plainLanguageText}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-600">
                Bu yapay zekâ açıklaması resmî bir uygunluk kararı değildir.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
